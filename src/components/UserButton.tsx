"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { LogOutIcon, UserIcon, Monitor, MoonIcon, SunIcon, Check } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/(auth)/actions";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
const queryClient = useQueryClient();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user || !mounted) return null;

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setDropdownOpen(false);
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <button className={className}>
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent key={resolvedTheme}> {/* 🔥 Force re-render after theme change */}
        <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/user/${user.username}`}>
          <DropdownMenuItem>
            <UserIcon className="size-4 mr-2" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="size-4 mr-2" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuContent>
            {mounted && (
              <>
                <DropdownMenuItem onClick={() => handleThemeChange("light")}>
                  <SunIcon className="size-4 mr-2" /> Light {resolvedTheme === "light" && <Check className="size-4 ml-2 text-green-500" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
                  <MoonIcon className="size-4 mr-2" /> Dark {resolvedTheme === "dark" && <Check className="size-4 ml-2 text-green-500" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("system")}>
                  <Monitor className="size-4 mr-2" /> System {resolvedTheme === "system" && <Check className="size-4 ml-2 text-green-500" />}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={()  =>
          { queryClient.clear();
            logout();}}>
          <LogOutIcon className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}