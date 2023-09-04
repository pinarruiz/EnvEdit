import React from "react";
import { ProjectCardProps } from "@/types/projectcard";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectCard(props: ProjectCardProps) {
  return (
    <div
      className={cn(
        "rounded-md border py-3 px-4 flex flex-col transition h-full hover:scale-105",
        props.loading
          ? "hover:cursor-progress"
          : "hover:bg-accent hover:cursor-pointer",
      )}
      onClick={
        props.loading
          ? undefined
          : () => window.location.assign(`/project/${props.projectId}`)
      }
    >
      {props.loading ? (
        <>
          <Skeleton className="w-full h-6" />
          <div className="pt-6">
            <Skeleton className="w-full h-10" />
          </div>
        </>
      ) : (
        <>
          <p className="font-bold">{props.projectName}</p>
          <p className="pt-6 text-sm opacity-40">{props.namespace}</p>
        </>
      )}
    </div>
  );
}
