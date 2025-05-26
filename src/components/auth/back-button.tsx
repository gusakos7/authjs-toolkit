"use client";

import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps {
  label: string;
  href: string;
}

export const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button size={"sm"} asChild variant={"link"} className="w-full font-normal">
      <Link href={href}>{label}</Link>
    </Button>
  );
};
