import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import { auth } from "@clerk/nextjs/server";
import Address from "@/models/Address";

export async function GET(request) {
  try {
    const { userId } = await auth(request);

    await dbConnect();

    const address = await Address.find({ userId });

    return NextResponse.json({
      success: true,
      data: address,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch address",
    });
  }
}