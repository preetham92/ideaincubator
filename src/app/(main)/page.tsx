import PostEditor from "@/components/posts/editor/PostEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import ForYouFeed from "./ForYouFeed";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you" className="w-full">
        <TabsList className="flex justify-center w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-full p-1">
  <TabsTrigger
    value="for-you"
    className="w-1/2 text-center py-3 rounded-full font-medium text-gray-500 dark:text-gray-300 
              data-[state=active]:text-[#E94560] dark:data-[state=active]:text-[#E94560] relative">
    For You
    <span className="absolute bottom-0 left-0 w-full h-1 bg-[#E94560] 
                     scale-x-0 data-[state=active]:scale-x-100 transition-transform duration-300" />
  </TabsTrigger>

  <TabsTrigger
    value="following"
    className="w-1/2 text-center py-3 rounded-full font-medium text-gray-500 dark:text-gray-300 
              data-[state=active]:text-[#E94560] dark:data-[state=active]:text-[#E94560] relative">
    Following
    <span className="absolute bottom-0 left-0 w-full h-1 bg-[#E94560] 
                     scale-x-0 data-[state=active]:scale-x-100 transition-transform duration-300" />
  </TabsTrigger>
</TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}