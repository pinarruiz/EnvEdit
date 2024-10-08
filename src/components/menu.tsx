import React from "react";
import Link from "next/link";
import { Gitlab } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme/switcher";

export default function Menu() {
  return (
    <div className="pt-2">
      <div className="container bg-background p-2 shadow-sm flex border rounded-lg first:mr-auto last:ml-auto [&>*]:flex-1">
        <div>
          <Button className="text-lg font-semibold" variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
        <div className="text-center">
          <TooltipProvider>
            <Tooltip delayDuration={500}>
              <TooltipTrigger asChild>
                <Link
                  href="https://gitlab.com/pinarnet/envedit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="icon" variant="outline">
                    <Gitlab />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="mt-1">
                <p>PinarNet/EnvEdit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-col">
          <div className="self-end px-4">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
