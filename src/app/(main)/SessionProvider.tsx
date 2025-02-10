"use client";  // 👈 This makes it a Client Component

import { createContext, useContext, ReactNode } from "react";

interface SessionData {
  user: any; // Change `any` to the correct user type
}

// Create Context with a default value
export const SessionContext = createContext<SessionData | null>(null);

// Define the Provider component
export default function SessionProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: SessionData | null;
}) {
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook to access session
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
