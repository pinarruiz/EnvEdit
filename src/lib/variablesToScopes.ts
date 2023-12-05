import { ProjectVariableSchema } from "@gitbeaker/rest";

export default function variablesToScopes(variables: ProjectVariableSchema[]) {
  return Array.from(
    new Set(variables.map((variable) => variable.environment_scope)).values(),
  );
}
