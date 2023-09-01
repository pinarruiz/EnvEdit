import React from "react";
import { ProjectCardProps } from "@/types/projectcard";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectCard(props: ProjectCardProps) {
  return (
    <div
      className={cn(
        "rounded-md border py-3 px-4 flex transition-colors",
        props.loading ? "hover:cursor-progress" : "hover:bg-accent",
      )}
    >
      {props.loading ? (
        <Skeleton className="w-full h-6" />
      ) : (
        <>
          <p>{props.projectName}</p>
          <p className="flex-grow text-right">{props.namespace}</p>
        </>
      )}
    </div>
  );
}
