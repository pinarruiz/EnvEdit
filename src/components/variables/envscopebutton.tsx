import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCountdown } from "usehooks-ts";
import { cn } from "@/lib/utils";
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
    <div
      className={cn(
        "w-fit inline-flex rounded-lg",
        props.className,
        isConfirming && "",
      )}
      style={
        isConfirming
          ? {
              background: `conic-gradient(hsl(var(--primary)) ${isConfirmingCount}%, hsl(var(--card)) ${isConfirmingCount}%)`,
            }
          : {}
      }
    >
      <Button
        variant="outline"
        disabled={updateEnvScopesMutation.isPending}
        className={cn(
          "duration-300 transition-[opacity,background,border-color,color] m-1",
          scopedStatus === "pending" && "duration-1000 animate-pulse",
          envScopeIsEnabled &&
            "hover:bg-green-500 bg-green-600 dark:hover:bg-green-600 dark:bg-green-700 text-white hover:text-white dark:text-white",
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
        <p>{props.envScope}</p>
      </Button>
    </div>
  );
}
