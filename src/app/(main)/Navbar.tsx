"use client";

import SearchField from "@/components/SearchFeild";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import { useTheme } from "next-themes"; // ✅ Ensure theme updates navbar
import { useEffect, useState } from "react";

export default function Navbar() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // ✅ Prevents hydration issues

    return (
        <header className="sticky top-0 bg-gradient-to-r from-[#1A1A2E] to-[#16213E] shadow-md border-b border-white/20">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">
                
                {/* Logo */}
                <Link 
                    href="/" 
                    className="text-4xl font-extrabold text-[#E94560] transition duration-300 ease-in-out hover:scale-110"
                    style={{ fontFamily: "var(--font-logo)" }} // ✅ Skranji Font
                >
                    ideaura
                </Link>

                {/* Search Field */}
                <div className="relative flex-1 max-w-md mx-4">
                    <SearchField />
                </div>

                {/* User Button */}
                <UserButton className="text-white hover:opacity-80 transition duration-300 ease-in-out" />
            </div>
        </header>
    );
}
