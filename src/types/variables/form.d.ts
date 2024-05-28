import { ReactNode } from "react";
import { VariableCardProps } from "@/types/variables/card";

export type VariableFormProps = VariableCardProps & { children?: ReactNode };

export type GroupedVariables = Record<
  VariableFormProps["variable"]["value"],
  VariableFormProps["variable"]["environment_scope"][]
>;
