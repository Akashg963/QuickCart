import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

const authSeller = async (userId) => {
  try {
    if (!userId) return false;

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return user.publicMetadata.role === "seller";
  } catch (error) {
    console.error("authSeller:", error);
    return false;
  }
};

export default authSeller;