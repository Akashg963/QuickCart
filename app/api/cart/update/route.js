import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";

export async function POST(request) {
  try {
    // ✅ auth() MUST be inside the POST function
    const { userId } = await auth();

    console.log("Clerk User ID:", userId);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { cartData } = await request.json();

    await dbConnect();

    const user = await User.findById(userId);

    console.log("Mongo User:", user);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    user.cartItems = cartData;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}