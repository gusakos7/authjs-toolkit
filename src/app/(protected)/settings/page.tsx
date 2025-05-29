import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import React from "react";

export default async function SettingsPage() {
  const session = await auth();
  console.log({ user: session?.user.role });
  return (
    <div>
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/auth/login" });
        }}
      >
        <Button type="submit">Sign out</Button>
      </form>
    </div>
  );
}
