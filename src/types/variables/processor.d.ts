import { ProjectSchema, ProjectVariableSchema } from "@gitbeaker/rest";

export type VariableProcessorProps = {
  projectId: ProjectSchema["id"];
  loading?: boolean;
};

export type ConsolidatedVariables = Record<
  ProjectVariableSchema["key"],
  Record<
    ProjectVariableSchema["environment_scope"],
    ProjectVariableSchema["value"]
  >
>;
