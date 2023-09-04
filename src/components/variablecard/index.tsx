import React from "react";
import { VariableCardProps } from "@/types/variablecard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

function checkOverflow(ref: HTMLParagraphElement | null): boolean {
  if (ref) {
    return (
      ref.scrollHeight > ref.clientHeight || ref.scrollWidth > ref.clientWidth
    );
  }
  return false;
}

export default function VariableCard(props: VariableCardProps) {
  const envsPRef = React.useRef<HTMLParagraphElement>(null);

  return (
    <div
      className={cn(
        "rounded-md border py-3 px-4 flex flex-col sm:flex-row transition h-full",
        props.loading
          ? "hover:cursor-progress"
          : "hover:bg-accent hover:cursor-pointer",
      )}
    >
      {props.loading ? (
        <>
          <div className="pb-5 sm:pb-0">
            <Skeleton className="h-6 w-96 m-auto sm:m-0 sm:pb-0" />
          </div>
          <Skeleton className="h-6 w-40 m-auto sm:m-0 sm:ml-auto" />
        </>
      ) : (
        <>
          <p className="font-bold m-auto sm:m-0 pb-5 sm:pb-0">
            {props.variable_name}
          </p>
          <HoverCard open={checkOverflow(envsPRef.current) ? undefined : false}>
            <HoverCardTrigger asChild>
              <p
                ref={envsPRef}
                className="opacity-40 ml-auto sm:w-2/5 sm:text-right text-center w-full sm:whitespace-nowrap sm:overflow-hidden sm:text-ellipsis"
              >
                {Object.keys(props.variable).join(", ")}
              </p>
            </HoverCardTrigger>
            <HoverCardContent className="w-full">
              <h4 className="mb-4 text-sm font-medium leading-none text-center">
                Envs
              </h4>
              <ScrollArea className="rounded-md border h-72 p-4">
                {Object.keys(props.variable).map((env, index) => (
                  <div key={env}>
                    {env}
                    {Object.keys(props.variable).length - 1 !== index && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </HoverCardContent>
          </HoverCard>
        </>
      )}
    </div>
  );
}
