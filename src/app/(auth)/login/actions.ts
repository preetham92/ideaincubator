"use server";

import { loginSchema } from "@/lib/validation";
import bcrypt from "bcryptjs"; // ✅ Use bcrypt for verification
import { prisma } from "@/lib/prisma";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export async function login(credentials: { email: string; password: string }) {
  try {
    console.log("📩 Received Login Request:", credentials);

    // Validate user input
    const validatedData = loginSchema.safeParse(credentials);
    if (!validatedData.success) {
      console.error("❌ Validation Error:", validatedData.error);
      return { error: "Invalid input data" };
    }

    const { email, password } = validatedData.data;

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      console.warn("⚠️ Invalid email or password");
      return { error: "Invalid email or password" };
    }

    // Verify password using bcrypt
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      console.warn("⚠️ Incorrect password");
      return { error: "Invalid email or password" };
    }

    console.log("✅ Password Verified Successfully");

    // Create session
    const session = await lucia.createSession(user.id, {});
    if (!session) {
      console.error("❌ Failed to create session");
      return { error: "Failed to create session" };
    }

    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    console.log("🍪 Session Cookie Set Successfully");

    return { success: true };
  } catch (error) {
    console.error("🚨 Login Error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
