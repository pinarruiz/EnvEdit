import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { VariableFormProps } from "@/types/variableform";
import { UserContext } from "@/components/contexts/user";
import { UserContextProviderType } from "@/types/usercontext";
import { deleteVariable, updateCreateVariable } from "@/lib/gitlab/variables";
import CopyToClipboard from "@/components/clipboard/copy";

export default function VariableForm(props: VariableFormProps) {
  const queryClient = useQueryClient();
  const { userData } = React.useContext(UserContext) as UserContextProviderType;

  const updateEnvScopesMutation = useMutation({
    mutationKey: ["updateEnvScopes", props.project_id, props.variable_name],
    mutationFn: async (args: {
      value: VariableFormProps["variable"]["value"];
      environment_scope: VariableFormProps["variable"]["environment_scope"];
      enabled: boolean;
    }) => {
      if (userData.accessToken) {
        if (args.enabled) {
          return await updateCreateVariable(
            userData.accessToken,
            props.project_id,
            props.variable_name,
            args.value,
            args.environment_scope,
          );
        } else {
          return await deleteVariable(
            userData.accessToken,
            props.project_id,
            props.variable_name,
            args.environment_scope,
          );
        }
      }
    },
  });

  const variablePool = Object.keys(props.variable)
    .map((envName) => {
      return { environment_scope: envName, value: props.variable[envName] };
    })
    .reduce(
      (
        group: Record<
          VariableFormProps["variable"]["value"],
          VariableFormProps["variable"]["environment_scope"][]
        >,
        envVar,
      ) => {
        const { value } = envVar;
        group[value] = group[value] ?? [];
        group[value].push(envVar.environment_scope);
        return group;
      },
      {},
    );

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent
        className="transition-[padding] sm:p-8 px-6 rounded-md overflow-y-auto max-h-[90%] max-w-7xl md:w-[90%] w-[95%]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit {props.variable_name}</DialogTitle>
          <DialogDescription className="opacity-40">
            Found {Object.keys(props.variable).length} environments.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <Accordion type="multiple" className="w-full">
            {Object.keys(variablePool).map((envValue) => (
              <AccordionItem value={envValue} key={envValue}>
                <div className="flex items-center gap-4 [&>h3]:flex-grow">
                  <div className="flex gap-2">
                    <CopyToClipboard value={envValue} />
                  </div>
                  <AccordionTrigger className="flex-grow">
                    {envValue}
                  </AccordionTrigger>
                </div>
                <AccordionContent className="flex gap-2">
                  {props.env_scopes.map((envName) => (
                    <Button
                      key={envName}
                      variant="outline"
                      className={cn(
                        "duration-300 transition-[opacity,background]",
                        variablePool[envValue].includes(envName) &&
                          "bg-accent opacity-75 hover:opacity-100",
                      )}
                      onClick={async (event) => {
                        event.preventDefault();
                        await updateEnvScopesMutation.mutateAsync({
                          environment_scope: envName,
                          value: envValue,
                          enabled: !variablePool[envValue].includes(envName),
                        });
                        await queryClient.invalidateQueries({
                          queryKey: [
                            "variables",
                            props.project_id,
                            userData.accessToken,
                          ],
                        });
                      }}
                    >
                      {envName}
                    </Button>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <DialogFooter>
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
