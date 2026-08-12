import {v2 as cloudinary} from 'cloudinary'
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import { auth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
console.log("Product Import:", Product);
console.log("Type:", typeof Product);
console.log("Model Name:", Product?.modelName);
console.log("Has create:", typeof Product?.create);

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const authData = await auth();

console.log("AUTH DATA:", authData);
console.log("USER ID:", authData.userId);

if (!authData.userId) {
  return NextResponse.json(
    {
      success: false,
      message: "No authenticated user",
    },
    { status: 401 }
  );
}

const userId = authData.userId;

const isSeller = await authSeller(userId);

console.log("IS SELLER:", isSeller);

if (!isSeller) {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized seller",
    },
    { status: 403 }
  );
}

    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const offerPrice = formData.get("offerPrice");
    const category = formData.get("category");

    const files = formData.getAll("image");

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No images provided" });
    }

    const results = await Promise.all(
        files.map(async (file) => {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {resource_type: 'auto'},
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                stream.end(buffer);
            });

        })
    );

    const image = results.map((res) => res.secure_url);

    await dbConnect();

console.log("========== PRODUCT ==========");
console.log(Product);
console.log("typeof Product:", typeof Product);
console.log("Product.create:", Product.create);
console.log("Keys:", Object.keys(Product));
console.log("============================");

    const newProduct = await Product.create({
        userId,
        name,
        description,
        price: Number(price),
        offerPrice: Number(offerPrice),
        category,
        image,
        date: Date.now()
    });

    return NextResponse.json({ success: true,message: "Product added successfully", product: newProduct });
} catch (error) {
    return NextResponse.json({ success: false, message: error.message });
}

}