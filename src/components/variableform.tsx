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

export default function VariableForm(props: VariableFormProps) {
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
                <AccordionTrigger>{envValue}</AccordionTrigger>
                <AccordionContent className="">
                  {variablePool[envValue].map((envName) => (
                    <Button
                      key={envName}
                      variant="outline"
                      className="duration-300 transition-[opacity] bg-accent opacity-75 hover:opacity-100 m-1 first:ml-0 last:mr-0"
                      onClick={(event) => {
                        event.preventDefault();
                      }}
                    >
                      {envName}
                    </Button>
                  ))}
                  {Object.keys(props.variable)
                    .filter(
                      (envVar) =>
                        !Object.values(variablePool[envValue]).includes(envVar),
                    )
                    .map((envName) => (
                      <Button
                        key={envName}
                        variant="outline"
                        className="m-1 first:ml-0 last:mr-0"
                        onClick={(event) => {
                          event.preventDefault();
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
