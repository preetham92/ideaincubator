"use client";

import { useEffect, useState, useRef } from "react";
import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";

import MobileWhoToFollow from "@/components/mobileWhoToFollow";

import ForYouFeed from "./ForYouFeed";
import { getPosts } from "@/components/posts/editor/actions";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const observerRef = useRef(null);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);

  // 🚀 Fetch posts initially
  useEffect(() => {
    async function fetchPosts() {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    }
    fetchPosts();
  }, []);

  // 🎯 Show "Who to Follow" after 5 posts (only once on mobile)
  useEffect(() => {
    if (posts.length >= 6) {
      setShowMobileSuggestions(true);
    }
  }, [posts]);

  return (
    <div className="flex flex-col lg:flex-row justify-center lg:gap-10 w-full">
      {/* Main Content Section */}
      <main className="w-full lg:max-w-full">
        {/* ✅ Post Editor + For You Feed */}
        <div className="px-0 lg:px-2 mb-4">
          <PostEditor onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
            </div>
        <div className="w-full">
          <ForYouFeed />
        </div>

        {/* 📰 Posts & Mobile "Who to Follow" */}
        <div className="space-y-6 w-full" ref={observerRef}>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={post.id} className="w-full">
                <Post post={post} />
                {index === 5 && showMobileSuggestions && (
                  <div className="lg:hidden w-full mt-6">
                    <MobileWhoToFollow />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-300 text-lg mt-6">
              🏞️ Your feed is a blank canvas. Start painting some thoughts! 🎨
            </p>
          )}
        </div>
      </main>

      
      
    </div>
  );
}
