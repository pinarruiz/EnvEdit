import { ProjectVariableSchema } from "@gitbeaker/rest";
import { VariableCardProps } from "@/types/variablecard";

export type EnvScopeButtonProps = Pick<
  VariableCardProps,
  "variable_name" | "project_id"
> & {
  env_scope: ProjectVariableSchema["environment_scope"];
  env_value: ProjectVariableSchema["value"];
  className?: string;
};
