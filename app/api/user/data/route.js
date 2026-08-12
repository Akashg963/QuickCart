import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import User from "@/models/User";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await dbConnect();

    let user = await User.findById(userId);

    // Create user automatically if not found
    if (!user) {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);

      user = await User.create({
        _id: userId,
        name:
          clerkUser.fullName ||
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        email: clerkUser.emailAddresses[0].emailAddress,
        imageUrl: clerkUser.imageUrl,
        cartItems: {},
      });
    }

    return NextResponse.json({
      success: true,
      user,
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