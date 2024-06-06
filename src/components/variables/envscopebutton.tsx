import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCountdown } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnvScopeButtonProps } from "@/types/variables/envscopebutton";
import { UserContext } from "@/components/contexts/user";
import { UserContextProviderType } from "@/types/contexts/user";
import {
  deleteVariable,
  queryVariable,
  updateCreateVariable,
} from "@/lib/gitlab/variables";

const confirmTimeMs = 5000;
const confirmSteps = 100;

export default function EnvScopeButton(props: EnvScopeButtonProps) {
  const queryClient = useQueryClient();
  const { userData } = React.useContext(UserContext) as UserContextProviderType;

  const [
    isConfirmingCount,
    {
      startCountdown: isConfirmingCountdownStart,
      resetCountdown: isConfirmingCountdownReset,
    },
  ] = useCountdown({
    countStart: confirmSteps,
    intervalMs: Math.floor(confirmTimeMs / confirmSteps),
  });

  const isConfirming =
    isConfirmingCount !== 0 && isConfirmingCount !== confirmSteps;

  const scopedDataQueryKey = [
    "variableQuery",
    userData.accessToken,
    props.projectId,
    props.variableName,
    props.envScope,
  ];

  const { data: scopedData, status: scopedStatus } = useQuery({
    queryKey: scopedDataQueryKey,
    enabled:
      userData.accessToken !== undefined &&
      userData.accessToken !== null &&
      userData.accessToken !== "",
    queryFn: async () => {
      if (userData.accessToken) {
        try {
          return await queryVariable(
            userData.accessToken,
            props.projectId,
            props.variableName,
            props.envScope,
          );
        } catch (error) {
          return { value: props.envValue + "error" };
        }
      }
    },
  });

  const updateEnvScopesMutation = useMutation({
    mutationKey: [
      "updateEnvScopes",
      props.projectId,
      props.variableName,
      props.envValue,
    ],
    mutationFn: async (args: { enabled: boolean }) => {
      if (userData.accessToken) {
        if (args.enabled) {
          return await updateCreateVariable(
            userData.accessToken,
            props.projectId,
            props.variableName,
            props.envValue,
            props.envScope,
          );
        } else {
          return await deleteVariable(
            userData.accessToken,
            props.projectId,
            props.variableName,
            props.envScope,
          );
        }
      }
    },
  });

  const envScopeIsEnabled =
    scopedStatus !== "pending" &&
    scopedData &&
    scopedData.value === props.envValue;

  return (
    <Button
      variant={envScopeIsEnabled ? "default" : "outline"}
      className={cn(
        "duration-300 transition-[opacity,background,border-color,color]",
        props.className,
        scopedStatus === "pending" && "duration-1000 animate-pulse",
        envScopeIsEnabled &&
          "hover:bg-green-500 bg-green-600 dark:hover:bg-green-600 dark:bg-green-700 dark:text-white",
      )}
      onClick={async (event) => {
        event.preventDefault();
        if (scopedStatus !== "pending") {
          if (isConfirming) {
            isConfirmingCountdownReset();
            await updateEnvScopesMutation.mutateAsync({
              enabled: !envScopeIsEnabled,
            });
            await queryClient.invalidateQueries({
              queryKey: scopedDataQueryKey,
            });

            await queryClient.invalidateQueries({
              queryKey: ["variables", props.projectId, userData.accessToken],
            });
          } else {
            isConfirmingCountdownReset();
            isConfirmingCountdownStart();
          }
        }
      }}
    >
      <div className="flex">
        <CircleHelp
          className={cn(
            "durationj-300 transition-[transform,width,margin]",
            isConfirming ? "mr-2" : "scale-0 w-0 rotate-180",
          )}
        />
        <p>{props.envScope}</p>
      </div>
    </Button>
  );
}
