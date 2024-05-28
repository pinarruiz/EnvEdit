import { VariableCardProps } from "@/types/variables/card";

export type CreateScopeProps = Pick<
  VariableCardProps,
  "variableName" | "projectId" | "envScopes" | "extraEnvs" | "setExtraEnvs"
>;
