import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"),
  username: requiredString.regex(/^[a-zA-Z0-9_]{1,15}$/, "Only letters, numbers, and underscores allowed"),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: requiredString.email("Invalid email address"),
  password: requiredString.min(8, "Must be at least 8 characters"),
});

export const createPostSchema = z.object({
  content: requiredString,
})