import { ProjectVariableSchema } from "@gitbeaker/rest";

export type VariableCardProps = {
  variable: Record<
    ProjectVariableSchema["environment_scope"],
    ProjectVariableSchema["value"]
  >;
  variable_name: string;
};
