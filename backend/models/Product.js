import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "Bulldozer" },
    condition: { type: String, required: true },
    year: { type: Number, required: true },
    hours: { type: Number, required: true, min: 0 },
    power: { type: String, required: true },
    weight: { type: String, required: true },
    location: { type: String, required: true },
    salePrice: { type: Number, required: true, min: 0 },
    dailyRentalPrice: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    badge: { type: String, default: "Disponible" },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
