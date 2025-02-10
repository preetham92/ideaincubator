"use server"; // ✅ Required for server actions

import { cookies } from "next/headers"; // ✅ Server-side only
import { lucia } from "@/lib/auth";
import { cache } from "react";
import { redirect } from "next/navigation";

export const validateRequest = cache(
    async (): Promise<{ user: any; session: any } | { user: null; session: null }> => {
        const cookieStore = cookies(); // ✅ Safe to use here
        const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

        if (!sessionId) {
            return { user: null, session: null };
        }

        const result = await lucia.validateSession(sessionId);

        try {
            if (result.session && result.session.fresh) {
                const sessionCookie = lucia.createSessionCookie(result.session.id);
                cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
            }

            if (!result.session) {
                cookieStore.delete(lucia.sessionCookieName);
            }
        } catch (error) {
            console.error("Session validation error:", error);
        }

        return result;
    }
);

export async function logout() {
    const cookieStore = cookies();
    cookieStore.delete(lucia.sessionCookieName);
    redirect("/login");
}
