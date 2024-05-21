import {
  Gitlab,
  ProjectVariableSchema,
  SimpleProjectSchema,
} from "@gitbeaker/rest";
import { GITLAB_DOMAIN, GITLAB_PER_PAGE } from "@/lib/appEnv";

export async function queryVariables(
  oauthToken: string,
  projectId: SimpleProjectSchema["id"],
  page: number = 1,
) {
  const api = new Gitlab({
    host: `https://${GITLAB_DOMAIN}`,
    oauthToken: oauthToken,
  });
  return await api.ProjectVariables.all(projectId, {
    pagination: "offset",
    showExpanded: true,
    page: page,
    perPage: GITLAB_PER_PAGE,
  });
}

export async function createVariable(
  oauthToken: string,
  projectId: SimpleProjectSchema["id"],
  key: ProjectVariableSchema["key"],
  value: ProjectVariableSchema["value"],
  environmentScope: ProjectVariableSchema["environment_scope"],
) {
  const api = new Gitlab({
    host: `https://${GITLAB_DOMAIN}`,
    oauthToken: oauthToken,
  });

  return await api.ProjectVariables.create(projectId, key, value, {
    environmentScope: environmentScope,
    protected: true,
  });
}

export async function updateVariable(
  oauthToken: string,
  projectId: SimpleProjectSchema["id"],
  key: ProjectVariableSchema["key"],
  value: ProjectVariableSchema["value"],
  environmentScope: ProjectVariableSchema["environment_scope"],
) {
  const api = new Gitlab({
    host: `https://${GITLAB_DOMAIN}`,
    oauthToken: oauthToken,
  });

  return await api.ProjectVariables.edit(projectId, key, value, {
    environmentScope: environmentScope,
    filter: { environment_scope: environmentScope },
  });
}

export async function deleteVariable(
  oauthToken: string,
  projectId: SimpleProjectSchema["id"],
  key: ProjectVariableSchema["key"],
  environmentScope: ProjectVariableSchema["environment_scope"],
) {
  const api = new Gitlab({
    host: `https://${GITLAB_DOMAIN}`,
    oauthToken: oauthToken,
  });

  return await api.ProjectVariables.remove(projectId, key, {
    filter: { environment_scope: environmentScope },
  });
}

export async function updateCreateVariable(
  oauthToken: string,
  projectId: SimpleProjectSchema["id"],
  key: ProjectVariableSchema["key"],
  value: ProjectVariableSchema["value"],
  environmentScope: ProjectVariableSchema["environment_scope"],
) {
  try {
    return await updateVariable(
      oauthToken,
      projectId,
      key,
      value,
      environmentScope,
    );
  } catch (error) {
    return await createVariable(
      oauthToken,
      projectId,
      key,
      value,
      environmentScope,
    );
  }
}
