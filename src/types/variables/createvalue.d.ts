import React from "react";
import { GroupedVariables } from "@/types/variables/form";

export type CreateValueProps = {
  variablePool: GroupedVariables;
  setExtraEnvsValues: React.Dispatch<React.SetStateAction<GroupedVariables>>;
};
