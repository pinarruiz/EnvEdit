import { ProjectVariableSchema } from "@gitbeaker/rest";

export type VariableCardProps =
  | { loading: true }
  | {
      variable: ProjectVariableSchema;
      loading?: false;
    };
