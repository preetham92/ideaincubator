"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { submitPost } from "./actions";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import "./styles.css";

export default function PostEditor() {
  const { user } = useSession();
  const [isPosting, setIsPosting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: { HTMLAttributes: { class: "editor-paragraph" } },
      }),
      Placeholder.configure({ placeholder: "What's on your mind?" }),
    ],
    editorProps: { attributes: { class: "tiptap ProseMirror" } },
  });

  if (!isClient) return null;

  const input = editor?.getText({ blockSeparator: "\n" }) || "";

  async function onSubmit() {
    if (!input.trim()) return;
    setIsPosting(true);

    try {
      const optimisticPost = {
        id: `temp-${Date.now()}`,
        content: input,
        user: {
          username: user.username,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        },
        createdAt: new Date().toISOString(),
        _count: { likes: 0, comments: 0 },
        likes: [],
      };

      // ✅ Update cache optimistically
      queryClient.setQueryData(["post-feed", "for-you"], (oldData: any) => {
        if (!oldData?.pages?.length) return oldData;
        
        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          posts: [optimisticPost, ...newPages[0].posts],
        };
        
        return {
          ...oldData,
          pages: newPages,
        };
      });

      // ✅ Save to backend
      const savedPost = await submitPost(input);

      // ✅ Update with real post data
      queryClient.setQueryData(["post-feed", "for-you"], (oldData: any) => {
        if (!oldData?.pages?.length) return oldData;
        
        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          posts: newPages[0].posts.map(post => 
            post.id === optimisticPost.id ? savedPost : post
          ),
        };
        
        return {
          ...oldData,
          pages: newPages,
        };
      });

      editor?.commands.clearContent();
    } catch (error) {
      console.error("Failed to submit post:", error);
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["post-feed", "for-you"] });
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-3 p-4 rounded-lg border 
      dark:bg-[#121826] dark:border-gray-700 bg-gray-50 border-gray-300 
      shadow-sm transition-colors duration-200">
      <div className="flex items-start gap-3">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline-block shrink-0" />
        <div className="editor-container w-full bg-white dark:bg-gray-900/50 rounded-lg p-3">
          <EditorContent editor={editor} className="tiptap" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={isPosting || input.trim() === ""}
          className="bg-[#E94560] hover:bg-[#FF7E67] text-white 
            font-semibold rounded-full px-5 py-2 transition-all 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPosting ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}
