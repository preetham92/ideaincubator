// ForYouFeed.tsx
"use client";

import { useEffect } from 'react';
import InfiniteScrollContainer from "@/components/InfiniteScrollingContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Declare the window interface extension
declare global {
  interface Window {
    addNewPostToFeed?: (post: any) => void;
  }
}

export default function ForYouFeed() {
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: async ({ pageParam }) => {
      const response = await kyInstance
        .get("/api/forYouPage", pageParam ? { searchParams: { cursor: pageParam } } : {})
        .json<PostsPage>();
      
      return response;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 30000, // Cache data for 30 seconds
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Function to add new post to the feed
  const addNewPost = (newPost) => {
    queryClient.setQueryData(
      ["post-feed", "for-you"],
      (oldData: any) => {
        if (!oldData?.pages?.length) return oldData;

        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          posts: [newPost, ...newPages[0].posts],
        };

        return {
          ...oldData,
          pages: newPages,
        };
      }
    );
  };

  // Expose the addNewPost function to parent components
  useEffect(() => {
    window.addNewPostToFeed = addNewPost;
    
    // Cleanup function to remove the global function when component unmounts
    return () => {
      window.addNewPostToFeed = undefined;
    };
  }, []);

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No one has posted anything yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}