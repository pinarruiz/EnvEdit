import React from "react";
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
import { ChevronUp } from "lucide-react";
import { GroupedVariables, VariableFormProps } from "@/types/variables/form";
import CopyToClipboard from "@/components/clipboard/copy";
import CreateScope from "@/components/variables/createscope";
import EnvScopeButton from "@/components/variables/envscopebutton";
import CreateValue from "@/components/variables/createvalue";

export default function VariableForm(props: VariableFormProps) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [accordionOpen, setAccordionOpen] = React.useState<string[]>([]);
  const [extraEnvValues, setExtraEnvsValues] = React.useState<GroupedVariables>(
    {},
  );

  const variablePool = {
    ...extraEnvValues,
    ...Object.keys(props.variable)
      .map((envName) => {
        return { environment_scope: envName, value: props.variable[envName] };
      })
      .reduce((group: GroupedVariables, envVar) => {
        const { value } = envVar;
        group[value] = group[value] ?? [];
        group[value].push(envVar.environment_scope);
        if (!Object.keys(extraEnvValues).includes(value)) {
          setExtraEnvsValues((oldExtraEnvsValues) => {
            return { ...oldExtraEnvsValues, [value]: [] };
          });
        }
        return group;
      }, {}),
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent
        className="transition-[padding] sm:p-8 px-6 rounded-md overflow-y-auto max-h-[90%] max-w-7xl md:w-[90%] w-[95%] flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit {props.variableName}</DialogTitle>
          <DialogDescription className="opacity-40">
            Found {Object.keys(props.variable).length} environments.
          </DialogDescription>
        </DialogHeader>
        <div
          className={cn(
            "duration-300 sm:text-right overflow-hidden",
            Object.keys(variablePool).length <= 1 ? "min-h-0" : "min-h-10",
          )}
        >
          <Button
            variant="outline"
            className="w-full sm:w-fit min-w-36"
            onClick={(e) => {
              e.preventDefault();
              setAccordionOpen(
                accordionOpen.length > 0 ||
                  accordionOpen.length === Object.keys(variablePool).length
                  ? []
                  : Object.keys(variablePool),
              );
            }}
          >
            {accordionOpen.length > 0 ||
            accordionOpen.length === Object.keys(variablePool).length
              ? "Collapse all"
              : "Open all"}
            <ChevronUp
              className={cn(
                "w-4 h-4 ml-2 duration-300",
                accordionOpen.length > 0 ||
                  accordionOpen.length === Object.keys(variablePool).length
                  ? ""
                  : "rotate-180",
              )}
            />
          </Button>
        </div>
        <Accordion
          type="multiple"
          className="w-full"
          value={accordionOpen}
          onValueChange={setAccordionOpen}
        >
          {Object.keys(variablePool).map((envValue) => (
            <AccordionItem value={envValue} key={envValue}>
              <div className="flex items-center gap-4 [&>h3]:flex-grow">
                <div className="flex gap-2">
                  <CopyToClipboard value={envValue} />
                </div>
                <AccordionTrigger
                  className={cn(
                    "flex-grow break-all",
                    variablePool[envValue].length === 0 &&
                      "decoration-red-400 dark:decoration-red-800",
                  )}
                >
                  <p
                    className={cn(
                      "duration-300",
                      variablePool[envValue].length === 0 &&
                        "font-bold text-red-400 dark:text-red-600 ",
                    )}
                  >
                    {envValue}
                  </p>
                </AccordionTrigger>
              </div>
              <AccordionContent>
                {props.envScopes.map((envName) => (
                  <EnvScopeButton
                    key={envName}
                    className="first:ml-0 mr-[0.125rem] last:mr-0"
                    envValue={envValue}
                    envScope={envName}
                    projectId={props.projectId}
                    variableName={props.variableName}
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
          <CreateValue
            variablePool={variablePool}
            setExtraEnvsValues={setExtraEnvsValues}
          />
          <CreateScope
            variableName={props.variableName}
            envScopes={props.envScopes}
            projectId={props.projectId}
            extraEnvs={props.extraEnvs}
            setExtraEnvs={props.setExtraEnvs}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
