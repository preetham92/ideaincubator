"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Wrapper to avoid hydration issues
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-200 dark:bg-[#0F172A]" />;
  }

  return (
    <div className={`${theme === "dark" ? "bg-[#0F172A] text-white" : "bg-gray-50 text-black"} transition-all duration-300`}>
      {children}
    </div>
  );
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ThemeWrapper>{children}</ThemeWrapper>
    </NextThemesProvider>
  );
}
