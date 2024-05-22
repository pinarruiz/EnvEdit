import { VariableCardProps } from "@/types/variablecard";

export type CreateScopeProps = Pick<
  VariableCardProps,
  "variable_name" | "project_id" | "env_scopes" | "extraEnvs" | "setExtraEnvs"
>;
