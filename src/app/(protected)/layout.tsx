import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Navbar } from "./_components/navbar";
import { Toaster } from "@/components/ui/toaster";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className="min-h-full p-4 w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
        <Toaster />
        <Navbar />
        {children}
      </div>
    </SessionProvider>
  );
}
