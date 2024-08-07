import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VariableCardProps } from "@/types/variables/card";
import { Separator } from "@/components/ui/separator";
import VariableForm from "@/components/variables/form";
import { checkOverflow, cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";

const sharedAlertClassName = {
  base: "absolute duration-300 text-red-400 dark:text-red-800 sm:-right-1",
  hidden: "w-0 h-0 scale-0 rotate-180",
};

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
      <div
        className={cn(
          "rounded-md border py-3 px-4 flex flex-col sm:flex-row transition duration-300 h-full hover:bg-accent hover:cursor-pointer",
          Object.keys(props.variable).length === 0 &&
            "border-2 border-red-400 dark:border dark:border-red-800",
        )}
      >
        <p className="font-bold m-auto sm:m-0 pb-5 sm:pb-0 break-all text-center">
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
        <div className="w-6 h-6 m-auto sm:relative sm:w-0 sm:h-0 sm:m-0">
          <CircleAlert
            className={cn(
              sharedAlertClassName.base,
              Object.keys(props.variable).length === 0
                ? "duration-1000 animate-ping"
                : sharedAlertClassName.hidden,
            )}
          />
          <CircleAlert
            className={cn(
              sharedAlertClassName.base,
              Object.keys(props.variable).length === 0
                ? ""
                : sharedAlertClassName.hidden,
            )}
          />
        </div>
      </div>
    </VariableForm>
  );
}
