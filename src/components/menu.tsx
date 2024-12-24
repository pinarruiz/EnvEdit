import React from "react";
import Link from "next/link";
import { Gitlab } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme/switcher";

export default function Menu(props: { className?: string }) {
  return (
    <div className={cn("pt-2", props.className)}>
      <div className="container bg-background/75 dark:bg-background/85 z-40 backdrop-blur-sm backdrop-saturate-150 p-2 shadow-sm flex border rounded-lg first:mr-auto last:ml-auto [&>*]:flex-1">
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
                  <Button
                    size="icon"
                    variant="outline"
                    className="bg-background/50"
                  >
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
            <ThemeSwitcher className="bg-background/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
