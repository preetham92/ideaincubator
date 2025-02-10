"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation";
import { login } from "./actions"; // ✅ Import login function from actions.ts
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PasswordInput } from "@/components/ui/PasswordInput"; // ✅ Added import

type LoginValues = {
  email: string;
  password: string;
};

export default function Page() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // ✅ Add router for redirection

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setError(null);
    startTransition(async () => {
      try {
        const result = await login(values);
        if (result.error) {
          setError(result.error);
        } else if (result.success) {
          router.push("/"); // ✅ Redirects user after successful login
          router.refresh(); // ✅ Ensures session is updated
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  }

  return (
    <main className="flex h-screen items-center justify-center p-5 bg-gradient-to-r from-[#1A1A2E] to-[#16213E] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F3460] to-[#1A1A2E] opacity-50 blur-3xl"></div>

      <div className="relative backdrop-blur-xl bg-white/10 shadow-2xl flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-3xl overflow-hidden border border-white/20">
        <div className="flex flex-col w-full sm:w-1/2 p-10 text-white">
          <h1 className="text-5xl font-extrabold mb-3 text-[#E94560]">Login</h1>
          <p className="text-gray-300 mb-6">Welcome back! Enter your details to continue.</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-sm font-semibold">Email</label>
              <input
                {...form.register("email")}
                id="email"
                type="email"
                className="w-full bg-white/10 border border-white/30 rounded-lg p-3 mt-1 text-white focus:ring-2 focus:ring-[#E94560] outline-none placeholder-gray-400 transition duration-300 ease-in-out hover:border-white"
                placeholder="Enter your email"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-semibold">Password</label>
              <PasswordInput
                {...form.register("password")}
                id="password"
                placeholder="Enter your password"
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-[#E94560] hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="bg-gradient-to-r from-[#E94560] to-[#FF7E67] text-white font-semibold rounded-lg py-3 mt-5 shadow-lg hover:opacity-90 transition duration-300 ease-in-out hover:scale-105 hover:shadow-[#FF7E67]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPending ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm text-gray-300 text-center mt-4">
              Don't have an account? {" "}
              <Link href="/signup" className="text-[#E94560] font-semibold hover:underline">Sign Up</Link>
            </p>
          </form>
        </div>

        <div className="hidden sm:flex w-1/2 flex-col justify-center items-center relative bg-gradient-to-br from-[#0F3460] to-[#1A1A2E] p-5">
          <div className="transition duration-300 ease-in-out transform hover:scale-110">
            <Image
              src="/assets/login.png"
              alt="Login"
              width={350}
              height={350}
              priority
              className="rounded-lg shadow-xl shadow-[#E94560]/30"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
  