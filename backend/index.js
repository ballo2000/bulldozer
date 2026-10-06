import "dotenv/config";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import { demoProducts } from "../shared/products.js";
import {
  initializeCinetPayCheckout,
  isCinetPayConfigured,
  verifyCinetPayTransaction,
} from "./services/cinetpay.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const mobilePaymentsReady = isCinetPayConfigured();

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "demo-mode",
    mobilePayments: mobilePaymentsReady ? "cinetpay" : "not-configured",
  });
});

app.get("/api/products", async (_req, res, next) => {
  try {
    const products =
      mongoose.connection.readyState === 1
        ? await Product.find({ available: true }).sort({ createdAt: -1 }).lean()
        : demoProducts;
    res.json(products);
  } catch (error) {
    next(error);
  }
});

app.post("/api/orders", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: "La base de données est indisponible. Réessayez plus tard." });
    }

    const { productId, type, rentalDays, customer } = req.body;
    const firstName = typeof customer?.firstName === "string" ? customer.firstName.trim() : "";
    const lastName = typeof customer?.lastName === "string" ? customer.lastName.trim() : "";
    const name = `${firstName} ${lastName}`.trim();
    const phone = typeof customer?.phone === "string" ? customer.phone.trim() : "";
    const city = typeof customer?.city === "string" ? customer.city.trim() : "";
    const email = typeof customer?.email === "string" ? customer.email.trim() : "";

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "La machine sélectionnée est invalide." });
    }
    if (!["purchase", "rental"].includes(type)) {
      return res.status(400).json({ message: "Choisissez un achat ou une location." });
    }
    if (
      firstName.length < 2 ||
      firstName.length > 80 ||
      lastName.length < 2 ||
      lastName.length > 80 ||
      phone.length < 8 ||
      phone.length > 20 ||
      !city ||
      city.length > 100
    ) {
      return res.status(400).json({ message: "Vérifiez vos prénom, nom, téléphone et ville." });
    }
    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Une adresse e-mail valide est requise pour le paiement." });
    }
    const days = Number(rentalDays);
    if (type === "rental" && (!Number.isInteger(days) || days < 1 || days > 365)) {
      return res.status(400).json({ message: "La durée de location doit être comprise entre 1 et 365 jours." });
    }

    const product = await Product.findOne({ _id: productId, available: true });
    if (!product) {
      return res.status(404).json({ message: "Cette machine n’est plus disponible." });
    }
    if (!mobilePaymentsReady) {
      return res.status(503).json({
        message: "Le paiement n’est pas configuré. L’entreprise doit ajouter ses identifiants marchands CinetPay.",
      });
    }

    const total = type === "purchase" ? product.salePrice : product.dailyRentalPrice * days;
    const reference = `IM-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
    const order = await Order.create({
      reference,
      customer: { name, firstName, lastName, phone, email, city },
      product: product._id,
      productName: product.name,
      type,
      ...(type === "rental" && { rentalDays: days }),
      total,
      paymentMethod: "cinetpay-mobile-money",
      providerTransactionId: reference,
    });

    let paymentUrl;
    try {
      paymentUrl = await initializeCinetPayCheckout(order);
    } catch (error) {
      order.paymentStatus = "failed";
      await order.save();
      console.error("CinetPay checkout initialization failed:", error.message);
      return res.status(502).json({
        message: "La page de paiement n’a pas pu être créée. Vérifiez la configuration CinetPay et réessayez.",
      });
    }

    res.status(201).json({
      reference: order.reference,
      total: order.total,
      paymentStatus: order.paymentStatus,
      paymentUrl,
    });
  } catch (error) {
    next(error);
  }
});

async function synchronizePayment(order) {
  const payment = await verifyCinetPayTransaction(order.providerTransactionId);
  const amount = Number(payment.amount);
  const transactionId = String(payment.transaction_id ?? "");
  const currency = String(payment.currency ?? "").toUpperCase();

  if (transactionId !== order.providerTransactionId || amount !== order.total || currency !== "XOF") {
    throw new Error(`CinetPay returned mismatched payment details for ${order.reference}.`);
  }

  if (payment.status === "ACCEPTED") {
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    await order.save();
  } else if (["REFUSED", "CANCELLED"].includes(payment.status) && order.paymentStatus !== "paid") {
    order.paymentStatus = "failed";
    await order.save();
  }

  return { reference: order.reference, paymentStatus: order.paymentStatus };
}

app.post("/api/payments/cinetpay/notify", async (req, res, next) => {
  try {
    if (!mobilePaymentsReady) {
      return res.status(503).send("CinetPay is not configured.");
    }
    const transactionId = req.body.cpm_trans_id ?? req.body.transaction_id;
    if (typeof transactionId !== "string" || !/^IM-[A-F0-9]{16}$/.test(transactionId)) {
      return res.status(400).send("Invalid transaction reference.");
    }
    const order = await Order.findOne({ providerTransactionId: transactionId });
    if (!order) {
      return res.status(404).send("Order not found.");
    }
    await synchronizePayment(order);
    return res.status(200).send("OK");
  } catch (error) {
    next(error);
  }
});

app.get("/api/orders/:reference/payment-status", async (req, res, next) => {
  try {
    if (!/^IM-[A-F0-9]{16}$/.test(req.params.reference)) {
      return res.status(400).json({ message: "Référence de commande invalide." });
    }
    const order = await Order.findOne({ reference: req.params.reference });
    if (!order) {
      return res.status(404).json({ message: "Commande introuvable." });
    }
    if (order.paymentStatus === "pending" && mobilePaymentsReady) {
      return res.json(await synchronizePayment(order));
    }
    return res.json({ reference: order.reference, paymentStatus: order.paymentStatus });
  } catch (error) {
    next(error);
  }
});

app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Cette route API n’existe pas." });
});

app.use(express.static(clientDist));
app.use((req, res, next) => {
  if (req.method === "GET" && req.accepts("html")) {
    return res.sendFile(path.join(clientDist, "index.html"), (error) => {
      if (error) next(error);
    });
  }
  next();
});

app.use((error, _req, res, _next) => {
  console.error("API request failed:", error);
  res.status(500).json({ message: "Une erreur serveur est survenue." });
});

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB."))
    .catch((error) => console.error("MongoDB connection failed:", error.message));
} else {
  console.warn("MONGODB_URI is missing. Catalog runs in demo mode; orders are disabled.");
}
if (!mobilePaymentsReady) {
  console.warn("CinetPay checkout is disabled until its API key, site ID and public app URL are configured.");
}

app.listen(port, () => console.log(`Ivoire Machines API listening on http://localhost:${port}`));
