import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";
import MenuBar from "./MenuBar";
import ThemeProvider from "@/components/ThemeProvider";
import WhoToFollow from "@/components/WhoToFollow";
import TrendingTopics from "@/components/TrendingTopics";


export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await validateRequest();

  if (!session.user) {
    redirect("/login");
  }

  return (
    <SessionProvider value={session}>
      <ThemeProvider>
        <div className="flex min-h-screen flex-col transition-all duration-300">
          {/* 🔹 Navigation Bar */}
          <Navbar />

          <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 flex gap-6 mx-auto">
            {/* 🔹 Sidebar - Left (Control Center) */}
            <aside className="hidden sm:block flex-none w-[18rem] lg:w-[16rem] xl:w-[14rem]">
              <div className="sticky top-[5.25rem] space-y-5 rounded-2xl p-6 border border-white/15 transition-all duration-300 
                dark:bg-[#0F172A]/80 dark:shadow-[0px_4px_20px_rgba(233,69,96,0.3)] dark:backdrop-blur-2xl
                bg-white/50 shadow-md hover:shadow-lg dark:hover:shadow-[#E94560]/40">
                <MenuBar />
              </div>
            </aside>
           {/* Main Content Area */}
           <main className="mt-3 flex-1 min-w-0 sm:p-6 rounded-none sm:rounded-2xl border-0 sm:border transition-all duration-300
              dark:bg-[#121826]/80 dark:border-[#E94560]/30 dark:hover:shadow-[#E94560]/50
              bg-white sm:border-gray-300 hover:shadow-lg">
              {children}
            </main>
            
            <aside className="hidden lg:block w-[22rem] flex-none">
        <div 
          className="mt-3 overflow-x-auto rounded-2xl p-5 border border-white/10 transition-all duration-300 
          dark:bg-[#0F172A]/80 dark:shadow-[0px_3px_12px_rgba(233,69,96,0.2)] dark:backdrop-blur-xl 
          bg-white/60 shadow-sm hover:shadow-md dark:hover:shadow-[#E94550]/30"
          style={{ 
            height: 'calc(80vh - 90px)',
            paddingBottom: '70px', 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}
        >
          <TrendingTopics />
        </div>
        <br></br>
        <div 
        className="mt-5 sticky top-[var(--navbar-height,5rem)] space-y-6 rounded-2xl  p-6 border border-white/15 
          transition-all duration-300 dark:bg-[#0F172A]/90 dark:shadow-[0px_4px_15px_rgba(233,69,96,0.3)] 
          dark:backdrop-blur-xl bg-white/70 shadow-md hover:shadow-lg dark:hover:shadow-[#E94550]/40">
          <WhoToFollow />
        </div>

      </aside>
          </div>

          {/* 🔹 Mobile Floating Bottom Bar */}
          <div className="fixed bottom-0 w-full border-t bg-card p-3 sm:hidden shadow-lg backdrop-blur-lg bg-opacity-80">
            <MenuBar className="flex justify-center gap-5" />
          </div>
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}
