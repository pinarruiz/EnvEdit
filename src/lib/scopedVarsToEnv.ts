import { ProjectVariableSchema } from "@gitbeaker/rest";

export default function scopedVarsToEnv(args: {
  variables: ProjectVariableSchema[];
  environment_scope: ProjectVariableSchema["environment_scope"];
  includeDefault: boolean;
}) {
  const { variables, environment_scope, includeDefault } = args;
  let dotenvDoc = "";
  const variablesToWrite = variables.filter(
    (variable) =>
      variable.environment_scope === environment_scope ||
      (includeDefault && variable.environment_scope === "*"),
  );
  if (includeDefault && environment_scope !== "*") {
    for (let variable of variablesToWrite) {
      if (variable.environment_scope === "*") {
        dotenvDoc += `${variable.key}=${variable.value}\n`;
      }
    }
  }
  for (let variable of variablesToWrite) {
    if (variable.environment_scope === environment_scope) {
      dotenvDoc += `${variable.key}=${variable.value}\n`;
    }
  }
  return dotenvDoc;
}
