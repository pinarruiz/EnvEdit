import { ProjectVariableSchema } from "@gitbeaker/rest";

export type VariableCardProps =
  | { loading: true }
  | {
      variable: Record<
        ProjectVariableSchema["environment_scope"],
        ProjectVariableSchema["value"]
      >;
      variable_name: string;
      loading?: false;
    };
