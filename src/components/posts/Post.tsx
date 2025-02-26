"use client";
import { formatRelativeData } from "@/lib/utils";
import UserAvatar from "../UserAvatar";
import Link from "next/link";
import { useSession } from "@/app/(main)/SessionProvider";
import PostMoreButton from "./postMoreButton";

interface PostProps {
  post: {
    id: string;
    content: string;
    user: {
      id: string; // ✅ Ensure user ID is available
      username: string;
      displayName: string;
      avatarUrl: string;
    };
    createdAt: string;
  };
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  return (
    <article className="group/post p-4 rounded-lg border bg-white dark:bg-gray-900 flex gap-4">
      {/* ✅ Profile Link */}
      <Link href={`/users/${post.user.username}`} className="shrink-0">
        <UserAvatar avatarUrl={post.user.avatarUrl} />
      </Link>

      {/* ✅ Post Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div>
            <Link href={`/users/${post.user.username}`} className="block font-medium hover:underline">
              {post.user.displayName}
            </Link>
            <Link href={`/posts/${post.id}`} className="block text-sm text-muted-foreground">
              {formatRelativeData(new Date(post.createdAt))}
            </Link>
          </div>

          {/* ✅ Show "More Options" button only if the post belongs to the logged-in user */}
          {post.user.id === user?.id && (
            <PostMoreButton post={post} className="opacity-0 transition-opacity group-hover/post:opacity-100" />
          )}
        </div>

        <p className="text-gray-700 dark:text-gray-300 mt-2">{post.content}</p>
      </div>
    </article>
  );
}
