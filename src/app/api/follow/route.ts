// app/api/follow/route.ts
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { user: currentUser } = await validateRequest();
    
    if (!currentUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json();

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if user exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userToFollow) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: userId
        }
      }
    });

    if (existingFollow) {
      return Response.json({ error: "Already following this user" }, { status: 400 });
    }

    // Create follow relationship
    const follow = await prisma.follow.create({
      data: {
        followerId: currentUser.id,
        followingId: userId
      }
    });

    return Response.json({ success: true, follow });
  } catch (error) {
    console.error('Failed to follow user:', error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

