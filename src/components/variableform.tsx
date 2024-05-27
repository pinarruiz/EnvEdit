import React from "react";
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
import CopyToClipboard from "@/components/clipboard/copy";
import CreateScope from "@/components/createscope";
import EnvScopeButton from "@/components/envscopebutton";

export default function VariableForm(props: VariableFormProps) {
  const [openDialog, setOpenDialog] = React.useState(false);

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
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
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
              <AccordionContent>
                {props.env_scopes.map((envName) => (
                  <EnvScopeButton
                    key={envName}
                    className="m-1"
                    env_value={envValue}
                    env_scope={envName}
                    project_id={props.project_id}
                    variable_name={props.variable_name}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <DialogFooter className="flex gap-2">
          <Button
            className="sm:mr-auto"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              setOpenDialog(false);
            }}
          >
            Close
          </Button>
          <CreateScope
            variable_name={props.variable_name}
            env_scopes={props.env_scopes}
            project_id={props.project_id}
            extraEnvs={props.extraEnvs}
            setExtraEnvs={props.setExtraEnvs}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
