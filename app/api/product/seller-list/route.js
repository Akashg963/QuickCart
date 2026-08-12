import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/config/db";
import Product from "@/models/Product";
import authSeller from "@/lib/authSeller";

export async function GET() {
  try {
    const { userId } = await auth();

    console.log("Seller User ID:", userId);

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({
        success: false,
        message: "Not a seller",
      });
    }

    await dbConnect();

    const products = await Product.find({ userId });

    return NextResponse.json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}