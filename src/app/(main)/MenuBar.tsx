import { Button } from "@/components/ui/button";
import Link from "next/link"; // Changed import
import { Bell, Bookmark, Home } from "lucide-react";

interface MenuBarProps {
    className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
    return (
        <div className={className}>
            <Button
                variant="ghost"
                className="flex w-full items-center justify-start gap-3"
                asChild
            >
                <Link href="/">
                    <Home size={24} />
                    <span className="hidden lg:inline">Home</span>
                </Link>
            </Button>

            <Button
                variant="ghost"
                className="flex w-full items-center justify-start gap-3"
                asChild
            >
                <Link href="/notifications">
                    <Bell size={24} />
                    <span className="hidden lg:inline">Notifications</span>
                </Link>
            </Button>

            <Button
                variant="ghost"
                className="flex w-full items-center justify-start gap-3"
                asChild
            >
                <Link href="/messages">
                    🕊️
                    <span className="hidden lg:inline">Messages</span>
                </Link>
            </Button>

            <Button
                variant="ghost"
                className="flex w-full items-center justify-start gap-3"
                asChild
            >
                <Link href="/saved">
                    <Bookmark size={24} />
                    <span className="hidden lg:inline">Saved</span>
                </Link>
            </Button>
        </div>
    );
}