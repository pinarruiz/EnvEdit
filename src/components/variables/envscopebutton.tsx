import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export default function EnvScopeButton(props: EnvScopeButtonProps) {
  const queryClient = useQueryClient();
  const { userData } = React.useContext(UserContext) as UserContextProviderType;

  const scopedDataQUeryKey = [
    "variableQuery",
    userData.accessToken,
    props.projectId,
    props.variableName,
    props.envScope,
  ];

  const { data: scopedData, status: scopedStatus } = useQuery({
    queryKey: scopedDataQUeryKey,
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
      variant="outline"
      className={cn(
        "duration-300 transition-[opacity,background]",
        props.className,
        scopedStatus === "pending" && "duration-1000 animate-pulse",
        envScopeIsEnabled && "bg-accent opacity-75 hover:opacity-100",
      )}
      onClick={async (event) => {
        event.preventDefault();
        await updateEnvScopesMutation.mutateAsync({
          enabled: !envScopeIsEnabled,
        });
        await queryClient.invalidateQueries({
          queryKey: scopedDataQUeryKey,
        });
      }}
    >
      {props.envScope}
    </Button>
  );
}
