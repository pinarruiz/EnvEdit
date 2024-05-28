import { ProjectVariableSchema } from "@gitbeaker/rest";
import { VariableCardProps } from "@/types/variables/card";

export type EnvScopeButtonProps = Pick<
  VariableCardProps,
  "variableName" | "projectId"
> & {
  envScope: ProjectVariableSchema["environment_scope"];
  envValue: ProjectVariableSchema["value"];
  className?: string;
};
