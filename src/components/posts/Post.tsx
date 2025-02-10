import { formatRelativeData } from "@/lib/utils";
import UserAvatar from "../UserAvatar";
import Link from "next/link";

interface PostProps {
  post: {
    id: string;
    content: string;
    user: {
      username: string;
      displayName: string;
      avatarUrl: string;
    };
    createdAt: string; 
  };
}

export default function Post({ post }: PostProps) {
  return (
    <article className="p-4 rounded-lg border bg-white dark:bg-gray-900 flex gap-4">
      {/* ✅ Profile Link */}
      <Link href={`/users/${post.user.username}`}>
        <UserAvatar avatarUrl={post.user.avatarUrl} />
      </Link>

      {/* ✅ Post Content */}
      <div>
        <Link href={`/users/${post.user.username}`} className="block font-medium hover:underline">
          {post.user.displayName}
        </Link>

        <Link href={`/posts/${post.id}`} className="block text-sm text-muted-foreground">
          {formatRelativeData(new Date(post.createdAt))}
        </Link>

        <p className="text-gray-700 dark:text-gray-300 mt-2">{post.content}</p>
      </div>
    </article>
  );
}
