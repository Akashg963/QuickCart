import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

console.log(Product);
console.log(typeof Product.create);
console.log(Product.modelName);