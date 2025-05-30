import { Poppins } from "next/font/google";

import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";

const poppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function HomePage() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            poppinsFont.className
          )}
        >
          🔐Auth
        </h1>
        <p className="text-white text-lg">A simple authentication service</p>
        <div className="">
          <LoginButton mode="modal" asChild>
            <Button variant={"secondary"} size={"lg"}>
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
