"use client";

import { useEffect, useState, useRef } from "react";
import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import WhoToFollow from "@/components/WhoToFollow";
import MobileWhoToFollow from "@/components/mobileWhoToFollow";
import { getPosts } from "@/components/posts/editor/actions";
import TrendingTopics from "@/components/TrendingTopics";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const observerRef = useRef(null);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length >= 6) {
      setShowMobileSuggestions(true);
    }
  }, [posts]);

  const renderPosts = () => {
    if (posts.length === 0) {
      return (
        <p className="text-center text-gray-500 dark:text-gray-300">
          No posts yet. Start a conversation!
        </p>
      );
    }

    return posts.map((post, index) => (
      <div key={post.id} className="w-full">
        <Post post={post} />
        {index === 5 && showMobileSuggestions && (
          <div className="lg:hidden w-full">
            <MobileWhoToFollow />
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center lg:gap-10 w-full">
      {/* Main Content Section */}
      <main className="w-full lg:max-w-[600px] mx-auto">
        {/* Post Editor with padding only on larger screens */}
        <div className="px-0 lg:px-2 mb-4">
          <PostEditor onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
        </div>

        {/* Posts container with no padding on mobile */}
        <div className="space-y-[1px] w-full" ref={observerRef}>
          {renderPosts()}
        </div>
        
      </main>

      {/* Right Sidebar - Who to Follow (Visible only on large screens) */}
      <aside className="hidden lg:block w-[20rem] flex-none">
        <div className="sticky top-[var(--navbar-height,5.25rem)] space-y-6 rounded-2xl p-5 border border-white/15 
    transition-all duration-300 dark:bg-[#0F172A]/80 dark:shadow-[0px_4px_20px_rgba(233,69,96,0.4)] 
    dark:backdrop-blur-xl bg-white/60 shadow-md hover:shadow-lg dark:hover:shadow-[#E94550]/50">
          <WhoToFollow />
        </div>
        <div 
    className="mt-4 overflow-y-auto" 
    style={{ 
      height: 'calc(90vh - 90px)', // Adjust height dynamically
      paddingBottom: '80px', // Space for scrolling under navbar
      scrollbarWidth: 'none', // Hide scrollbar (Firefox)
      msOverflowStyle: 'none' // Hide scrollbar (IE)
    }}
  >
    <TrendingTopics />
  </div>
      </aside>
     
     
      
    </div>
  );
}