"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { submitPost } from "./actions";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import "./styles.css" 
export default function PostEditor({ onPostCreated }) { // ✅ Receive prop from Home.tsx
  const { user } = useSession();
  const [isPosting, setIsPosting] = useState(false);
  const [isClient, setIsClient] = useState(false);

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

    // ✅ Create a temporary post for instant UI update (Optimistic UI)
    const newPost = {
      id: Math.random().toString(36).substr(2, 9), // Fake ID for UI
      content: input,
      user: {
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      createdAt: new Date().toISOString(), // Temporary timestamp
    };

    onPostCreated(newPost); // ✅ Update UI immediately

    try {
      await submitPost(input); // ✅ Save to backend
      editor?.commands.clearContent();
    } catch (error) {
      console.error("Failed to submit post:", error);
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
            font-semibold rounded-lg px-5 py-2 transition-all 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPosting ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}
