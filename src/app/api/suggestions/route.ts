// app/api/suggestions/route.ts
import { prisma } from "@/lib/prisma";
import { validateRequest } from "@/lib/auth";

export async function GET() {
  try {
    const { user: currentUser } = await validateRequest();
    
    if (!currentUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        }
      },
      take: 3,
      orderBy: [
        {
          followers: {
            _count: 'desc'
          }
        },
        {
          createdAt: 'desc'
        }
      ]
    });

    // Transform the data to include follow counts
    const suggestionsWithCounts = suggestions.map(user => ({
      ...user,
      followerCount: user._count.followers,
      followingCount: user._count.following,
      isFollowing: false,
      _count: undefined
    }));

    return Response.json(suggestionsWithCounts);
  } catch (error) {
    console.error('Failed to fetch suggestions:', error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}