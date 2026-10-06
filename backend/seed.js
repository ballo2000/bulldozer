import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import { demoProducts } from "../shared/products.js";

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is missing. Copy .env.example to .env and configure MongoDB.");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.bulkWrite(
    demoProducts.map((product) => ({
      updateOne: {
        filter: { slug: product.slug },
        update: { $set: product },
        upsert: true,
      },
    })),
  );
  console.log(`Seeded ${demoProducts.length} demo bulldozers.`);
} catch (error) {
  console.error("Could not seed the product catalog:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
