"use client";

import { useEffect, useState } from "react";
import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import { getPosts } from "@/components/posts/editor/actions"; // ✅ Fetch posts dynamically


export default function Home() {
  const [posts, setPosts] = useState([]);

  // ✅ Fetch posts when the component loads
  useEffect(() => {
    async function fetchPosts() {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    }
    fetchPosts();
  }, []);

  return (
    <main className="w-full min-w-0 flex gap-5">
      <div className="w-full min-w-0 space-y-5">
        {/* ✅ Pass function to update state instantly */}
        <PostEditor onPostCreated={(newPost) => setPosts([newPost, ...posts])} />

        {/* ✅ Display Posts */}
        <div className="mt-6 space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-300">No posts yet. Start a conversation!</p>
          )}
        </div>
      </div>
      
    </main>
  );
}
