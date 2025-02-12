// components/TrendingTopics.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

interface TrendingTopic {
  id: string;
  topic: string;
  postCount: number;
  category?: string;
}

export default function TrendingTopics() {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchTrendingTopics();
  }, []);

  const fetchTrendingTopics = async () => {
    try {
      // TODO: Replace with actual API call
      // Mock data for now
      const mockTopics: TrendingTopic[] = [
        { id: '1', topic: 'AI Development', postCount: 5420, category: 'Technology' },
        { id: '2', topic: 'Climate Change', postCount: 3250, category: 'Science' },
        { id: '3', topic: 'Web Development', postCount: 2800, category: 'Programming' },
        { id: '4', topic: 'Remote Work', postCount: 2100, category: 'Work' },
        { id: '5', topic: 'Renewable Energy', postCount: 1900, category: 'Environment' },
      ];
      setTopics(mockTopics);
    } catch (error) {
      console.error('Failed to fetch trending topics:', error);
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (!mounted) return null;

  return (
    <div className={`rounded-lg border ${
      resolvedTheme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
    } p-4`}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-[#E94560]" />
        <h2 className="font-semibold">Trending Topics</h2>
      </div>
      
      <div className="space-y-4">
        {topics.map((topic) => (
          <Link 
            href={`/search?q=${encodeURIComponent(topic.topic)}`}
            key={topic.id} 
            className="block hover:bg-gray-100 dark:hover:bg-gray-800 -mx-4 px-4 py-2 transition-colors duration-200"
          >
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{topic.category}</p>
              <p className="font-medium">{topic.topic}</p>
              <p className="text-sm text-muted-foreground">
                {formatCount(topic.postCount)} posts
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}