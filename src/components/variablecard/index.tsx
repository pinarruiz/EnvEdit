import React from "react";
import { VariableCardProps } from "@/types/variablecard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function VariableCard(props: VariableCardProps) {
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
          <div className="pb-5">
            <Skeleton className="h-6 w-96 m-auto sm:m-0 sm:pb-0" />
          </div>
          <Skeleton className="h-6 w-40 m-auto sm:m-0 sm:ml-auto" />
        </>
      ) : (
        <>
          <p className="font-bold m-auto sm:m-0 pb-5 sm:pb-0">
            {props.variable_name}
          </p>
          <p className="opacity-40 ml-auto sm:w-2/5 overflow-y-scroll">
            {Object.keys(props.variable).join(", ")}
          </p>
        </>
      )}
    </div>
  );
}
