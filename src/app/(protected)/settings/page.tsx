"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import React from "react";

export default function SettingsPage() {
  const user = useCurrentUser();

  const onClick = () => {
    logout();
  };
  return (
    <div className="bg-white p-10 rounded-xl">
      <Button type="submit" onClick={onClick}>
        Sign out
      </Button>
    </div>
  );
}
