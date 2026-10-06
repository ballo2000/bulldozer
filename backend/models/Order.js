import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true, trim: true },
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true, lowercase: true },
      city: { type: String, required: true, trim: true },
    },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    type: { type: String, enum: ["purchase", "rental"], required: true },
    rentalDays: { type: Number, min: 1 },
    total: { type: Number, required: true, min: 1 },
    paymentMethod: {
      type: String,
      enum: ["orange-money", "mtn-momo", "cinetpay-mobile-money"],
      required: true,
    },
    providerTransactionId: { type: String },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    orderStatus: { type: String, enum: ["awaiting-payment", "confirmed", "cancelled"], default: "awaiting-payment" },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
