"use client";

import { useEffect, useState, useRef } from "react";
import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import WhoToFollow from "@/components/WhoToFollow";
import { getPosts } from "@/components/posts/editor/actions";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const observerRef = useRef(null);

  // ✅ Fetch posts initially
  useEffect(() => {
    async function fetchPosts() {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    }
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-0 lg:gap-10 p-0 w-full">
      {/* Main Content Section */}
      <main className="w-full max-w-[600px] mx-auto space-y-6 p-2">
        <PostEditor onPostCreated={(newPost) => setPosts([newPost, ...posts])} />

        {/* ✅ Who to Follow for Mobile (Horizontal Scroll) */}
        <div className="sm:hidden w-full overflow-x-auto no-scrollbar py-2">
          <WhoToFollow horizontal />
        </div>

        <div className="space-y-5" ref={observerRef}>
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-300">
              No posts yet. Start a conversation!
            </p>
          )}
        </div>
      </main>

      {/* Right Sidebar - Who to Follow (Visible only on large screens) */}
      <aside className="hidden lg:block w-[20rem] flex-none">
        <div className="sticky top-[5.25rem] space-y-6 rounded-2xl p-5 border border-white/15 transition-all duration-300 
          dark:bg-[#0F172A]/80 dark:shadow-[0px_4px_20px_rgba(233,69,96,0.4)] dark:backdrop-blur-xl
          bg-white/60 shadow-md hover:shadow-lg dark:hover:shadow-[#E94550]/50">
          <WhoToFollow />
        </div>
      </aside>
    </div>
  );
}