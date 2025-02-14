import PostEditor from "@/components/posts/editor/PostEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import ForYouFeed from "./ForYouFeed";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        {/* Post Editor */}
        <PostEditor />

        {/* Instagram-Style Tabs */}
        <Tabs defaultValue="for-you" className="w-full">
          {/* Tabs List - Instagram Style */}
          <TabsList className="flex w-full max-w-sm mx-auto border-b border-gray-300 dark:border-gray-700">
            {/* For You Tab */}
            <TabsTrigger
              value="for-you"
              className="w-1/2 text-center py-3 font-medium text-gray-600 dark:text-gray-400 
                         data-[state=active]:text-black data-[state=active]:dark:text-white 
                         relative transition-all"
            >
              For You
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black dark:bg-white scale-0 
                              data-[state=active]:scale-100 transition-transform" />
            </TabsTrigger>

            {/* Following Tab */}
            <TabsTrigger
              value="following"
              className="w-1/2 text-center py-3 font-medium text-gray-600 dark:text-gray-400 
                         data-[state=active]:text-black data-[state=active]:dark:text-white 
                         relative transition-all"
            >
              Following
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black dark:bg-white scale-0 
                              data-[state=active]:scale-100 transition-transform" />
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="for-you" className="mt-4">
            <ForYouFeed />
          </TabsContent>

          <TabsContent value="following" className="mt-4">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
