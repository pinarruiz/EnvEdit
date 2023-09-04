import React from "react";
import { VariableFormProps } from "@/types/variableform";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function VariableForm(props: VariableFormProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {props.variable_name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <VariableFormBody
            variable={props.variable}
            variable_name={props.variable_name}
          />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VariableFormBody(props: VariableFormProps) {
  return <div>{props.variable_name}</div>;
}
