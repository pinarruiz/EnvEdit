import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VariableCardProps } from "@/types/variablecard";
import { Separator } from "@/components/ui/separator";
import VariableForm from "@/components/variables/form";

function checkOverflow(ref: HTMLParagraphElement | null): boolean {
  if (ref) {
    return (
      ref.scrollHeight > ref.clientHeight || ref.scrollWidth > ref.clientWidth
    );
  }
  return false;
}

export function LoadingVariableCard() {
  return (
    <div className="rounded-md border py-3 px-4 flex flex-col gap-4 sm:flex-row transition h-full hover:cursor-progress">
      <div className="pb-5 sm:pb-0">
        <Skeleton className="h-6 w-full sm:w-96 m-auto sm:m-0 sm:pb-0" />
      </div>
      <Skeleton className="h-6 w-1/3 sm:w-40 m-auto sm:m-0 sm:ml-auto" />
    </div>
  );
}

export default function VariableCard(props: VariableCardProps) {
  const envsPRef = React.useRef<HTMLParagraphElement>(null);

  return (
    <VariableForm
      variable={props.variable}
      variableName={props.variableName}
      projectId={props.projectId}
      envScopes={props.envScopes}
      extraEnvs={props.extraEnvs}
      setExtraEnvs={props.setExtraEnvs}
    >
      <div className="rounded-md border py-3 px-4 flex flex-col sm:flex-row transition h-full hover:bg-accent hover:cursor-pointer">
        <p className="font-bold m-auto sm:m-0 pb-5 sm:pb-0">
          {props.variableName}
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
      </div>
    </VariableForm>
  );
}
