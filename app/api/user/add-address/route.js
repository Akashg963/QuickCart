import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import User from "@/models/User";
import Address from "@/models/Address";


export async function POST(request) {
        try {

            const { userId } = await auth();
            const { address } = await request.json();

            await dbConnect();
            const newAddress = await Address.create({ ...address, userId });

            return NextResponse.json({
                success: true,
                message: "Address added successfully",
                data: newAddress,
            });
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: 500 }
            );
        }

}