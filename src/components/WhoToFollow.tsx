// components/suggestions/WhoToFollow.tsx
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
  const [loading, setLoading] = useState(false);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/suggestions');
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const handleFollow = async (userId: string) => {
    setLoadingStates(prev => ({ ...prev, [userId]: true }));
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) throw new Error('Failed to follow user');
      
      setFollowingStates(prev => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.error('Failed to follow user:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (!mounted) return null;

  return (
    <div className={`rounded-lg border ${
      resolvedTheme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
    } p-4 sticky top-4`}>
      <h2 className="font-semibold mb-4">Who to follow</h2>
      
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
              disabled={followingStates[user.id]}
            >
              {followingStates[user.id] ? (
                'Following'
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Follow
                </>
              )}
            </LoadingButton>
          </div>
        ))}
      </div>

      <Button 
        variant="link" 
        className="w-full mt-4 text-sm text-muted-foreground"
        onClick={fetchSuggestions}
      >
        Show more
      </Button>
    </div>
  );
}