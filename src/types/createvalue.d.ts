import React from "react";
import { GroupedVariables } from "@/types/variableform";

export type CreateValueProps = {
  variablePool: GroupedVariables;
  setExtraEnvsValues: React.Dispatch<React.SetStateAction<GroupedVariables>>;
};
