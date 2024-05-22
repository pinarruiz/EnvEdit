import React from "react";
import { ProjectVariableSchema, SimpleProjectSchema } from "@gitbeaker/rest";

export type VariableCardProps = {
  variable: Record<
    ProjectVariableSchema["environment_scope"],
    ProjectVariableSchema["value"]
  >;
  variable_name: string;
  project_id: SimpleProjectSchema["id"];
  env_scopes: ProjectVariableSchema["environment_scope"][];
  extraEnvs: VariableCardProps["variable"]["environment_scope"][];
  setExtraEnvs: React.Dispatch<
    React.SetStateAction<VariableCardProps["variable"]["environment_scope"][]>
  >;
};
