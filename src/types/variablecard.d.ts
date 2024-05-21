import { ProjectVariableSchema, SimpleProjectSchema } from "@gitbeaker/rest";

export type VariableCardProps = {
  variable: Record<
    ProjectVariableSchema["environment_scope"],
    ProjectVariableSchema["value"]
  >;
  variable_name: string;
  project_id: SimpleProjectSchema["id"];
  env_scopes: ProjectVariableSchema["environment_scope"][];
};
