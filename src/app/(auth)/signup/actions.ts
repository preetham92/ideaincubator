"use server";

import { signUpSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function signUp(credentials: { username: string; email: string; password: string }) {
  try {
    console.log("📩 Received Signup Request:", credentials);

    // Validate user input
    const validatedData = signUpSchema.safeParse(credentials);
    if (!validatedData.success) {
      console.error("❌ Validation Error:", validatedData.error);
      return { error: "Invalid input data" };
    }

    const { username, email, password } = validatedData.data;

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: { equals: username, mode: "insensitive" } }, { email: { equals: email, mode: "insensitive" } }],
      },
    });

    if (existingUser) {
      console.warn("⚠️ Duplicate User Detected:", existingUser);
      return {
        error: existingUser.username.toLowerCase() === username.toLowerCase() ? "Username already taken" : "Email already taken",
      };
    }

    // Hash the password using bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("🔒 Password Hashed Successfully");

    // Generate a secure user ID
    const userId = randomUUID();
    console.log("🆔 Generated User ID:", userId);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        email,
        password: passwordHash,
      },
    });

    if (!newUser) {
      console.error("❌ Failed to create user in database");
      return { error: "Failed to create user" };
    }

    console.log("✅ User Created Successfully:", newUser);

    return { success: true, message: "Account created successfully! Press OK to Login." };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    console.error("🚨 Signup Error:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}
