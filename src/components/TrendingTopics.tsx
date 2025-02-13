"use client";
import { useEffect, useState } from "react";
import { Flame, Hash, TrendingUp, User } from "lucide-react";


export default function TrendingTopics() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    async function fetchTrendingTopics() {
      try {
        const response = await fetch("/api/trendingtopics");

        if (!response.ok) {
          console.error("HTTP error! status:", response.status);
          return;
        }

        const data = await response.json();
        setTrending(data);
      } catch (error) {
        console.error("Failed to fetch trending topics:", error);
      }
    }

    fetchTrendingTopics();
  }, []);

  return (
    <div className="p-5 rounded-2xl border border-white/15 bg-white/60 dark:bg-[#0F172A]/80 shadow-md 
      hover:shadow-lg dark:hover:shadow-[#E94550]/50 transition-all duration-300 space-y-4">
      
      <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
  <TrendingUp className="h-6 w-6 text-[#E94560]" />
  Currently Popular
</h2>
      
      <ul className="space-y-3">
        {trending.map((item) => (
          <li key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 
            dark:hover:bg-gray-800 cursor-pointer transition-all duration-200">
            
            {item.type === "hashtag" && <Hash className="h-5 w-5 text-[#E94560]" />}
            {item.type === "post" && <Flame className="h-5 w-5 text-orange-500" />}
            {item.type === "user" && <User className="h-5 w-5 text-blue-500" />}
            
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {item.type === "hashtag" && `#${item.title} (${item.count} mentions)`}
              {item.type === "post" && `${item.title} (${item.count} interactions)`}
              {item.type === "user" && `${item.title} (${item.count} followers)`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
