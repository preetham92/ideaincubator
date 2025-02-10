import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";
import MenuBar from "./MenuBar";
import ThemeProvider from "@/components/ThemeProvider"; // ✅ Corrected import

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await validateRequest();

  if (!session.user) {
    redirect("/login");
  }

  return (
    <SessionProvider value={session}>
      <ThemeProvider>
        <div className="flex min-h-screen flex-col transition-all duration-300">
          {/* Navbar */}
          <Navbar />

          <div className="max-w-7xl w-full p-6 flex gap-8 mx-auto">
            {/* Sidebar - Glass Effect & Adaptive Theme */}
            <aside className="hidden sm:block flex-none w-[18rem] lg:w-[16rem] xl:w-[14rem]">
              <div className="sticky top-[5.25rem] space-y-5 rounded-2xl p-6 border border-white/15 transition-all duration-300 
                dark:bg-[#0F172A]/70 dark:shadow-[0px_4px_20px_rgba(233,69,96,0.3)] dark:backdrop-blur-2xl
                bg-white/50 shadow-md hover:shadow-lg dark:hover:shadow-[#E94560]/40">
                <MenuBar />
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 p-6 rounded-2xl border transition-all duration-300
              dark:bg-[#121826]/80 dark:border-[#E94560]/30 dark:hover:shadow-[#E94560]/50
              bg-white border-gray-300 hover:shadow-lg">
              {children}
            </main>
          </div>

          {/* ✅ Mobile Bottom Navbar - Corrected Placement */}
          <div className="fixed bottom-0 w-full border-t bg-card p-3 sm:hidden">
            <MenuBar className="flex justify-center gap-5" />
          </div>

        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}
