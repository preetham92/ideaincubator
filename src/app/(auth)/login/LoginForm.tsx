"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation";
import { Form, FormControl, FormField, FormLabel, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { login } from "@/app/(auth)/login/actions";  // Updated import path
import LoadingButton from "@/components/lodingbutton";
import Link from "next/link";

type LoginValues = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
        if (result?.error) setError(result.error);
      } catch (error) {
        setError("Invalid login credentials");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-5">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-[#E94560] hover:underline">Forgot password?</Link>
        </div>

        <LoadingButton loading={isPending} type="submit" className="mt-4" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </LoadingButton>

        <p className="text-sm text-gray-300 text-center mt-4">
          Don't have an account? {" "}
          <Link href="/signup" className="text-[#E94560] font-semibold hover:underline">Sign Up</Link>
        </p>
      </form>
    </Form>
  );
}