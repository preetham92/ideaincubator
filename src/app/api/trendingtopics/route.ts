import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET() {
  try {
    console.log("Fetching trending topics...");

    // 🔹 Fetch latest 100 posts
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        content: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    console.log(`Fetched ${posts.length} posts.`);

    // 🔹 Extract Hashtags
    const hashtagCounts: Record<string, number> = {};
    posts.forEach((post) => {
      const hashtags = post.content.match(/#[a-zA-Z0-9_]+/g) || [];
      hashtags.forEach((tag) => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      });
    });

    console.log("Hashtag counts:", hashtagCounts);

    const trendingHashtags = Object.entries(hashtagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count], index) => ({
        id: `hashtag-${index}`,
        type: "hashtag",
        title: topic,
        count,
      }));

    // 🔹 Fetch Top Posts
    const topPosts = posts
      .sort((a, b) => b._count.likes + b._count.comments - (a._count.likes + a._count.comments))
      .slice(0, 5)
      .map((post, index) => ({
        id: `post-${index}`,
        type: "post",
        title: post.content.slice(0, 50) + "...",
        count: post._count.likes + post._count.comments,
      }));

    console.log("Top posts:", topPosts);

    // 🔹 Fetch Most Followed Users
    const trendingUsers = await prisma.user.findMany({
      select: { id: true, username: true, displayName: true, avatarUrl: true, _count: { select: { followers: true } } },
      orderBy: { followers: { _count: "desc" } },
      take: 5,
    });

    console.log(`Fetched ${trendingUsers.length} trending users.`);

    const trendingUserData = trendingUsers.map((user, index) => ({
      id: `user-${index}`,
      type: "user",
      title: user.displayName,
      username: user.username,
      avatarUrl: user.avatarUrl,
      count: user._count.followers,
    }));

    // 🔹 Combine All Trending Data
    const trendingData = [...trendingHashtags, ...topPosts, ...trendingUserData];

    return NextResponse.json(trendingData);
  } catch (error) {
    console.error("❌ ERROR fetching trending data:", error);
    return NextResponse.json({ error: "Failed to load trending data", details: error.message }, { status: 500 });
  }
}
