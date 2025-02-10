"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/validation";
import { useRouter } from "next/navigation"; // ✅ Import useRouter for redirection
import { signUp } from "@/app/(auth)/signup/actions";

type SignUpValues = {
  username: string;
  email: string;
  password: string;
};

export default function SignUpForm() {
  const router = useRouter(); // ✅ Use Next.js router
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    setError(null);
    startTransition(async () => {
      try {
        const result = await signUp(values);
        if (result?.error) {
          setError(result.error);
        } else if (result?.success) {
          alert(result.message); // ✅ Show success message
          router.push("/"); // ✅ Redirect only after the user presses OK
        }
      } catch (error) {
        setError("An error occurred during signup");
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-5">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label htmlFor="username" className="text-sm font-semibold">Username</label>
        <input
          {...form.register("username")}
          id="username"
          type="text"
          className="w-full bg-white/10 border border-white/30 rounded-lg p-3 mt-1 text-white"
          placeholder="Enter your username"
        />
        {form.formState.errors.username && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.username.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-semibold">Email</label>
        <input
          {...form.register("email")}
          id="email"
          type="email"
          className="w-full bg-white/10 border border-white/30 rounded-lg p-3 mt-1 text-white"
          placeholder="Enter your email"
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-semibold">Password</label>
        <input
          {...form.register("password")}
          id="password"
          type="password"
          className="w-full bg-white/10 border border-white/30 rounded-lg p-3 mt-1 text-white"
          placeholder="Enter your password"
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-gradient-to-r from-[#E94560] to-[#FF7E67] text-white font-semibold rounded-lg py-3 mt-5 shadow-lg hover:opacity-90 transition duration-300 ease-in-out hover:scale-105"
      >
        {isPending ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
