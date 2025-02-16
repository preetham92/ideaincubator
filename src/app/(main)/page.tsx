"use client";
import { useState, useEffect } from "react";
import PostEditor from "@/components/posts/editor/PostEditor";
import ForYouFeed from "./ForYouFeed";
import FollowingFeed from "./FollowingFeed";
import MobileWhoToFollow from "@/components/mobileWhoToFollow";

export default function Home() {
  const [activeFeed, setActiveFeed] = useState("for-you");
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);

  // Monitor posts length for mobile suggestions
  useEffect(() => {
    // You can get the posts length from ForYouFeed or your state management solution
    const checkPostsLength = async () => {
      // Assuming you have a way to check posts length
      // if (posts.length >= 6) {
      setShowMobileSuggestions(true);
      // }
    };
    checkPostsLength();
  }, []);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        
        {/* Custom Toggle Instead of Tabs */}
        <div className="flex justify-center w-full">
          <div className="flex bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 
                          rounded-full p-1 shadow-md w-[250px]">
            <button
              className={`w-1/2 text-center py-3 rounded-full font-medium transition-all 
                          ${activeFeed === "for-you"
                ? "bg-[#E94560] text-white shadow-md"
                : "text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveFeed("for-you")}
            >
              For You
            </button>
            <button
              className={`w-1/2 text-center py-3 rounded-full font-medium transition-all 
                          ${activeFeed === "following"
                ? "bg-[#E94560] text-white shadow-md"
                : "text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              onClick={() => setActiveFeed("following")}
            >
              Following
            </button>
          </div>
        </div>

        {/* Content Based on Selected Feed */}
        {activeFeed === "for-you" ? (
          <div className="space-y-6 w-full">
            <ForYouFeed showMobileSuggestions={showMobileSuggestions} />
          </div>
        ) : (
          <FollowingFeed />
        )}
      </div>
    </main>
  );
}