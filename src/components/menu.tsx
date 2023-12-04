import React from "react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme/switcher";
import Link from "next/link";

export default function Menu() {
  return (
    <div className="pt-2">
      <div className="container bg-background p-2 shadow-sm flex border rounded-lg">
        <Button className="text-lg font-semibold" variant={"ghost"} asChild>
          <Link href="/">Home</Link>
        </Button>
        <div className="flex-grow flex flex-col">
          <div className="self-end px-4">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
