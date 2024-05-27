import { VariableCardProps } from "@/types/variablecard";

export type CreateScopeProps = Pick<
  VariableCardProps,
  "variableName" | "projectId" | "envScopes" | "extraEnvs" | "setExtraEnvs"
>;
