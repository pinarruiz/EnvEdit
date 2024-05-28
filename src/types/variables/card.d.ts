import React from "react";
import { ProjectVariableSchema, SimpleProjectSchema } from "@gitbeaker/rest";

export type VariableCardProps = {
  variable: Record<
    ProjectVariableSchema["environment_scope"],
    ProjectVariableSchema["value"]
  >;
  variableName: string;
  projectId: SimpleProjectSchema["id"];
  envScopes: ProjectVariableSchema["environment_scope"][];
  extraEnvs: VariableCardProps["variable"]["environment_scope"][];
  setExtraEnvs: React.Dispatch<
    React.SetStateAction<VariableCardProps["variable"]["environment_scope"][]>
  >;
};
