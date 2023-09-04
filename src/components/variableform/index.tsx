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
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { VariableFormProps } from "@/types/variableform";

export default function VariableForm(props: VariableFormProps) {
  const [environmentValues, setEnvironmentValues] = React.useState(
    props.variable,
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
            Found {Object.keys(environmentValues).length} environments.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <VariableFormBody
            variable={props.variable}
            variable_name={props.variable_name}
            environmentValues={environmentValues}
            setEnvironmentValues={setEnvironmentValues}
          />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VariableFormBody(
  props: VariableFormProps & {
    environmentValues: VariableFormProps["variable"];
    setEnvironmentValues: React.Dispatch<
      React.SetStateAction<VariableFormProps["variable"]>
    >;
  },
) {
  const [anyMod, setAnyMod] = React.useState(false);
  const envs = Object.keys(props.environmentValues);

  !anyMod &&
    Object.keys(props.variable).forEach((key) => {
      if (!envs.includes(key)) {
        props.setEnvironmentValues((prev) => {
          return { ...prev, ...{ [key]: props.variable[key] } };
        });
      }
    });

  return (
    <form className="flex flex-col gap-4">
      <datalist id={`envs${props.variable_name}`}>
        {envs.map((env) => (
          <option key={`evso${props.variable_name}${env}`} value={env} />
        ))}
      </datalist>
      {envs.map((env) => (
        <div key={`${env}${props.environmentValues[env]}`} className="flex">
          <Input
            defaultValue={env}
            className="w-1/3 mr-7"
            list={`envs${props.variable_name}`}
          />
          <Input defaultValue={props.environmentValues[env]} className="mr-7" />
          <Button
            id={env}
            variant="destructive"
            type="button"
            size="icon"
            className="w-10 h-10 flex-shrink-0"
            onClick={(e) => {
              e.preventDefault();
              setAnyMod(true);
              delete props.environmentValues[e.currentTarget.id];
              props.setEnvironmentValues({ ...props.environmentValues });
            }}
          >
            <Trash />
          </Button>
        </div>
      ))}
    </form>
  );
}
