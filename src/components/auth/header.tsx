import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full gap-y-4 flex flex-col items-center justify-center">
      <h1 className={cn("text-3xl font-semibold", font.className)}> 🔐Auth</h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
