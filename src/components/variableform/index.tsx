import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray } from "react-hook-form";
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
import { VariableFormProps } from "@/types/variableform";

export default function VariableForm(props: VariableFormProps) {
  const formSchema = Yup.object().shape({
    environments: Yup.array().of(
      Yup.object().shape({
        environment_scope: Yup.string().required("Value is mendatory"),
        value: Yup.string().required("Value is mendatory"),
      }),
    ),
  });

  const optionsDf = { resolver: yupResolver(formSchema) };
  const {
    control,
    // formState,
    // handleSubmit,
    // register,
    watch,
    // reset
  } = useForm(optionsDf);

  // const { errors } = formState;
  const {
    // fields,
    append,
    // remove
  } = useFieldArray({
    name: "environments",
    control,
  });

  const environments = watch("environments");

  Object.keys(props.variable).forEach((key) => {
    if (
      environments?.filter((env) => env.environment_scope === key).length === 0
    ) {
      append({
        environment_scope: key,
        value: props.variable[key],
      });
    }
  });

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
          <div className="grid gap-4 py-4"></div>
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
