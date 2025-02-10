"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

export default function SearchField() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!search.trim()) return;
        router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }

    // Return null or a placeholder during server-side rendering
    if (!mounted) {
        return (
            <div className="relative flex items-center">
                <Input
                    name="q"
                    placeholder="Search"
                    className="pe-10 text-black bg-white border border-gray-300 rounded-lg"
                    disabled
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <SearchIcon className="size-5" />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="relative flex items-center">
            <Input
                name="q"
                placeholder="Search"
                className={`pe-10 border rounded-lg focus:ring-2 focus:ring-[#E94560] transition duration-300 ease-in-out ${
                    resolvedTheme === "dark" 
                        ? "text-white bg-gray-800 border-gray-600" 
                        : "text-black bg-white border-gray-300"
                }`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#E94560] transition duration-300 ease-in-out"
            >
                <SearchIcon className="size-5" />
            </button>
        </form>
    );
}