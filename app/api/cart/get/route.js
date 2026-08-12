import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";


export async function GET(request) {
  try {

    const { userId } = await auth(request);

    await dbConnect();

    const user = await User.findById(userId);

    const { cartItems } = user;

    return NextResponse.json({
      success: true,
      data: cartItems,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch cart items",
    });
  }

}