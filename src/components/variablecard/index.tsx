import React from "react";
import { VariableCardProps } from "@/types/variablecard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function VariableCard(props: VariableCardProps) {
  return (
    <div
      className={cn(
        "rounded-md border py-3 px-4 flex transition h-full",
        props.loading
          ? "hover:cursor-progress"
          : "hover:bg-accent hover:cursor-pointer",
      )}
    >
      {props.loading ? (
        <>
          <Skeleton className="h-6 w-96" />
          <Skeleton className="h-6 w-40 ml-auto" />
        </>
      ) : (
        <>
          <p className="font-bold">{props.variable.key}</p>
          <p className="text-sm opacity-40 flex-grow text-right">
            {props.variable.environment_scope}
          </p>
        </>
      )}
    </div>
  );
}
