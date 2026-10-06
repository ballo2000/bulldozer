import { useCallback, useEffect, useState } from "react";
import { demoProducts } from "../../shared/products.js";
import ContactPage from "./pages/ContactPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import MachinesPage from "./pages/MachinesPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import SiteFooter from "./shared/SiteFooter.jsx";
import SiteHeader from "./shared/SiteHeader.jsx";
import OrderModal from "./shared/OrderModal.jsx";

const pagePaths = ["/", "/machines", "/services", "/contact"];

function App() {
  const [products, setProducts] = useState(demoProducts);
  const [apiMode, setApiMode] = useState("loading");
  const [pathname, setPathname] = useState(window.location.pathname);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentReturn, setPaymentReturn] = useState(null);

  const navigate = useCallback((path) => {
    if (!pagePaths.includes(path)) return;
    if (window.location.pathname !== path || window.location.search) {
      window.history.pushState({}, "", path);
    }
    setPathname(path);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => {
        if (!response.ok) throw new Error("Catalogue indisponible");
        return response.json();
      })
      .then((items) => {
        if (!Array.isArray(items)) throw new Error("Réponse catalogue invalide");
        setProducts(items);
        setApiMode("connected");
      })
      .catch(() => setApiMode("demo"));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference");
    if (params.get("payment") !== "return" || !reference) return;

    setPaymentReturn({ reference, status: "checking" });
    fetch(`/api/orders/${encodeURIComponent(reference)}/payment-status`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Vérification du paiement impossible.");
        setPaymentReturn({ ...result, error: "" });
      })
      .catch((error) => setPaymentReturn({ reference, status: "pending", error: error.message }));
    window.history.replaceState({}, "", window.location.pathname);
    setPathname(window.location.pathname);
  }, []);

  async function checkPayment(reference) {
    setPaymentReturn({ reference, status: "checking" });
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(reference)}/payment-status`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Vérification du paiement impossible.");
      setPaymentReturn({ ...result, error: "" });
    } catch (error) {
      setPaymentReturn({ reference, status: "pending", error: error.message });
    }
  }

  const pageProps = { products, apiMode, navigate, onOrder: setSelectedProduct };
  const page = {
    "/": <HomePage {...pageProps} />,
    "/machines": <MachinesPage {...pageProps} />,
    "/services": <ServicesPage navigate={navigate} />,
    "/contact": <ContactPage />,
  }[pathname] || <HomePage {...pageProps} />;

  return (
    <>
      <SiteHeader pathname={pathname} navigate={navigate} />
      {paymentReturn && (
        <aside className={`payment-return payment-return-${paymentReturn.paymentStatus || paymentReturn.status}`} role="status">
          <div>
            <b>{paymentReturn.paymentStatus === "paid" ? "Paiement confirmé" : paymentReturn.paymentStatus === "failed" ? "Paiement non abouti" : "Paiement en cours de vérification"}</b>
            <span>{paymentReturn.error || `Commande ${paymentReturn.reference}${paymentReturn.paymentStatus === "paid" ? " : votre demande est confirmée." : paymentReturn.paymentStatus === "failed" ? " : vous pouvez relancer une commande." : " : patientez puis vérifiez à nouveau."}`}</span>
          </div>
          {paymentReturn.paymentStatus !== "paid" && <button disabled={paymentReturn.status === "checking"} onClick={() => checkPayment(paymentReturn.reference)}>{paymentReturn.status === "checking" ? "Vérification…" : "Vérifier le paiement"}</button>}
        </aside>
      )}
      <main>{page}</main>
      <SiteFooter navigate={navigate} />
      {selectedProduct && <OrderModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  );
}

export default App;
