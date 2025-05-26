"use client";
import { FcGoogle } from "react-icons/fc";
import { SiKeycloak } from "react-icons/si";
import { Button } from "../ui/button";
export const Social = () => {
  return (
    <div className="flex items-center w-full space-x-2">
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => {}}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => {}}
      >
        <SiKeycloak className="h-5 w-5" />
      </Button>
    </div>
  );
};
