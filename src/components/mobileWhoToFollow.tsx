// components/suggestions/MobileWhoToFollow.tsx
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

export default function MobileWhoToFollow() {
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
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
    <div className={`w-full rounded-lg border ${
      resolvedTheme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
    } p-4 my-4`}>
      <h2 className="font-semibold mb-4 px-2">Suggested for you</h2>
      
      <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2">
        {suggestions.map((user) => (
          <div 
            key={user.id} 
            className="flex flex-col items-center min-w-[150px] p-2 rounded-lg"
          >
            <Link 
              href={`/user/${user.username}`} 
              className="flex flex-col items-center text-center mb-2"
            >
              <UserAvatar avatarUrl={user.avatarUrl} size={64} />
              <p className="font-medium mt-2 text-sm truncate w-full">
                {user.displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate w-full">
                @{user.username}
              </p>
            </Link>
            
            <LoadingButton
              variant="outline"
              size="sm"
              className="w-full mt-1"
              loading={loadingStates[user.id]}
              onClick={() => handleFollow(user.id)}
              disabled={followingStates[user.id]}
            >
              {followingStates[user.id] ? (
                'Following'
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Follow
                </>
              )}
            </LoadingButton>
          </div>
        ))}
      </div>
    </div>
  );
}