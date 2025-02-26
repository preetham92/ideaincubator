// app/api/unfollow/route.ts
import  { prisma }  from "@/lib/prisma";
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
  
      // Delete follow relationship
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: userId
          }
        }
      });
  
      return Response.json({ success: true });
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }