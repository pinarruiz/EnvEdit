import React from "react";
import { ConsolidatedVariables } from "@/types/variables/processor";
import { ProjectVariableSchema } from "@gitbeaker/rest";

export type CreateVarProps = {
  consolidatedVariables: ConsolidatedVariables;
  setExtraVars: React.Dispatch<
    React.SetStateAction<ProjectVariableSchema["key"][]>
  >;
  loading?: boolean;
};
