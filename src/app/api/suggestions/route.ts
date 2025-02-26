// app/api/suggestions/route.ts
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { user: currentUser } = await validateRequest();
    
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract offset for pagination (default 0)
    const { searchParams } = new URL(req.url);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Fetch users not followed by current user, including follow counts
    const suggestions = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUser.id } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: currentUser.id
                }
              }
            }
          }
        ]
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        _count: {
          select: {
            followers: true,
            following: true
          }
        },
        followers: {
          where: { followerId: currentUser.id },
          select: { id: true } // Check if user is already followed
        }
      },
      take: 4, // Limit results per request
      skip: offset, // Implement pagination
      orderBy: [
        { followers: { _count: 'desc' } }, // Most followed users first
        { createdAt: 'desc' } // Newer users next
      ]
    });

    // Transform data to include `isFollowing`
    const suggestionsWithCounts = suggestions.map(user => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      followerCount: user._count.followers,
      followingCount: user._count.following,
      isFollowing: user.followers.length > 0 // If `followers` array has data, user is already followed
    }));

    return NextResponse.json(suggestionsWithCounts);
  } catch (error) {
    console.error('Failed to fetch suggestions:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
