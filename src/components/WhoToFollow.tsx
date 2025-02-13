"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import LoadingButton from "./lodingbutton";
import Link from "next/link";
import { UserPlus } from "lucide-react";

interface SuggestedUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isFollowing: boolean;
}

export default function WhoToFollow() {
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [offset, setOffset] = useState(0); // ✅ Track offset
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false); // ✅ Track if expanded
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchSuggestions(); // ✅ Load initial users
  }, []);

  const fetchSuggestions = async () => {
    if (loading) return; // Prevent multiple clicks

    setLoading(true);
    try {
      const response = await fetch(`/api/suggestions?offset=${offset}`);
      const newUsers = await response.json();

      // ✅ Append new users to existing list
      setSuggestions((prev) => [
        ...prev,
        ...newUsers.filter((user) => !prev.some((u) => u.id === user.id)), // Avoid duplicates
      ]);

      setOffset((prevOffset) => prevOffset + newUsers.length); // ✅ Update offset
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    setLoadingStates((prev) => ({ ...prev, [userId]: true }));

    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to follow user");

      setSuggestions((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFollowing: true } : user
        )
      );
    } catch (error) {
      console.error("Failed to follow user:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleToggleExpand = () => {
    if (expanded) {
      // ✅ Collapse: Show only the first 3 users
      setSuggestions((prev) => prev.slice(0, 3));
      setOffset(3); // Reset offset for future expansions
    } else {
      // ✅ Expand: Fetch more users
      fetchSuggestions();
    }
    setExpanded(!expanded); // Toggle state
  };

  if (!mounted) return null;

  return (
    <div className={`rounded-lg border ${
      resolvedTheme === "dark" ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
    } p-4 sticky top-4`}>
      <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">Similar Minds</h2>

      <div className="space-y-4">
        {suggestions.map((user) => (
          <div key={user.id} className="flex items-center justify-between gap-2">
            <Link href={`/user/${user.username}`} className="flex items-center gap-2 min-w-0 flex-1">
              <UserAvatar avatarUrl={user.avatarUrl} size={40} />
              <div className="min-w-0">
                <p className="font-medium truncate">{user.displayName}</p>
                <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
              </div>
            </Link>

            <LoadingButton
              variant="outline"
              size="sm"
              loading={loadingStates[user.id]}
              onClick={() => handleFollow(user.id)}
              disabled={user.isFollowing}
            >
              {user.isFollowing ? "Following" : <><UserPlus className="h-4 w-4" /> Follow</>}
            </LoadingButton>
          </div>
        ))}
      </div>

      {/* ✅ Show More / Show Less Button */}
      <Button
        variant="link"
        className="w-full mt-4 text-sm text-muted-foreground"
        onClick={handleToggleExpand}
      >
        {expanded ? "Show less" : loading ? "Loading..." : "Show more"}
      </Button>
    </div>
  );
}
