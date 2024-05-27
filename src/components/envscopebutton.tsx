import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EnvScopeButtonProps } from "@/types/envscopebutton";
import { UserContext } from "@/components/contexts/user";
import { UserContextProviderType } from "@/types/usercontext";
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
    props.project_id,
    props.variable_name,
    props.env_scope,
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
            props.project_id,
            props.variable_name,
            props.env_scope,
          );
        } catch (error) {
          return { value: props.env_value + "error" };
        }
      }
    },
  });

  const updateEnvScopesMutation = useMutation({
    mutationKey: [
      "updateEnvScopes",
      props.project_id,
      props.variable_name,
      props.env_value,
    ],
    mutationFn: async (args: { enabled: boolean }) => {
      if (userData.accessToken) {
        if (args.enabled) {
          return await updateCreateVariable(
            userData.accessToken,
            props.project_id,
            props.variable_name,
            props.env_value,
            props.env_scope,
          );
        } else {
          return await deleteVariable(
            userData.accessToken,
            props.project_id,
            props.variable_name,
            props.env_scope,
          );
        }
      }
    },
  });

  const envScopeIsEnabled =
    scopedStatus !== "pending" &&
    scopedData &&
    scopedData.value === props.env_value;

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
      {props.env_scope}
    </Button>
  );
}
