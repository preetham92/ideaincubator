import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { Lucia } from "lucia";
import { cookies } from "next/headers";


const prisma = new PrismaClient();

// ✅ Ensure you use correct Prisma model names for sessions & users
const adapter = new PrismaAdapter(prisma.session || prisma.session, prisma.user); 

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    },
    getUserAttributes(databaseUserAttributes) {
        return {
            id: databaseUserAttributes.id,
            username: databaseUserAttributes.username,
            displayName: databaseUserAttributes.displayName,
            avatarUrl: databaseUserAttributes.avatarUrl,
            googleId: databaseUserAttributes.googleId,
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    googleId: string | null;
}

export async function validateRequest() {
    const cookieStore = await cookies(); // ✅ Await `cookies()` before using it
    const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
        return { user: null, session: null };
    }

    try {
        const result = await lucia.validateSession(sessionId);

        if (!result.session) {
            return { user: null, session: null };
        }

        return result;
    } catch (error) {
        console.error("Session validation error:", error);
        return { user: null, session: null };
    }
}