import { validateRequest } from "@/lib/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import Linkify from "@/components/Linkify";
import TrendsSidebar from "@/components/TrendingTopics";
import UserAvatar from "@/components/UserAvatar";
import {prisma} from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import EditProfileButton from "./EditProfileButton";
import UserPosts from "./UserPosts";

interface PageProps {
  params: { username: string };
}

// Cached user fetching function
const getUser = cache(async (username: string, loggedInUserId?: string) => {
  if (!username) return null;
  
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: getUserDataSelect(loggedInUserId || ""),
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
});

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  try {
    const { user: loggedInUser } = await validateRequest();
    const user = await getUser(username, loggedInUser?.id);

    if (!user) {
      return {
        title: "User Not Found",
      };
    }

    return {
      title: `${user.displayName} (@${user.username})`,
      description: user.bio || `Profile of ${user.displayName}`,
    };
  } catch (error) {
    return {
      title: "Error",
    };
  }
}

export default async function Page({ params: { username } }: PageProps) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      redirect("/login");
    }

    const user = await getUser(username, loggedInUser.id);

    if (!user) {
      notFound();
    }

    return (
      <main className="flex w-full min-w-0 gap-5">
        <div className="w-full min-w-0 space-y-5">
          <UserProfile user={user} loggedInUserId={loggedInUser.id} />
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <h2 className="text-center text-2xl font-bold">
              {user.displayName}&apos;s posts
            </h2>
          </div>
          <UserPosts userId={user.id} />
        </div>
        <TrendsSidebar />
      </main>
    );
  } catch (error) {
    console.error("Error in page render:", error);
    return notFound();
  }
}

function UserProfile({ user, loggedInUserId }: { user: UserData; loggedInUserId: string }) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}