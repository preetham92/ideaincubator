import { NextResponse } from "next/server";
import {prisma }from "@/lib/prisma";

export async function GET() {
  try {
    // Get a count of all users
    const userCount = await prisma.user.count();
    
    // Get the first few users
    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        username: true,
        displayName: true
      }
    });

    // Try to find the specific user
    const specificUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: 'lasagna6',
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        username: true,
        displayName: true
      }
    });

    return NextResponse.json({
      totalUsers: userCount,
      sampleUsers: users,
      specificUserFound: specificUser ? true : false,
      specificUser: specificUser
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}