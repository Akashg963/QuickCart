import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    

    await dbConnect();

    const products = await Product.find({});

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