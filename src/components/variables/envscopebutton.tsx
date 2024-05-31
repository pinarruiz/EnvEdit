import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTimeout } from "@mantine/hooks";
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

export default function EnvScopeButton(props: EnvScopeButtonProps) {
  const queryClient = useQueryClient();
  const { userData } = React.useContext(UserContext) as UserContextProviderType;

  const [confirm, setConfirm] = React.useState(false);
  const { start: confirmTimerStart } = useTimeout(
    () => setConfirm(false),
    5000,
  );

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
      variant="outline"
      className={cn(
        "duration-300 transition-[opacity,background,border-color] border-2 dark:border",
        props.className,
        scopedStatus === "pending" && "duration-1000 animate-pulse",
        envScopeIsEnabled && "border-green-500 dark:border-green-800",
      )}
      onClick={async (event) => {
        event.preventDefault();
        if (confirm) {
          setConfirm(false);
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
          setConfirm(true);
          confirmTimerStart();
        }
      }}
    >
      <div className="flex">
        <CircleHelp
          className={cn(
            "durationj-300 transition-[transform,width,margin]",
            confirm ? "mr-2" : "scale-0 w-0 rotate-180",
          )}
        />
        <p>{props.envScope}</p>
      </div>
    </Button>
  );
}
