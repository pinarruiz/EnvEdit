import { Gitlab } from "@gitbeaker/rest";
import { GITLAB_DOMAIN, GITLAB_PER_PAGE } from "@/lib/appEnv";

export async function queryVariables(
  oauthToken: string,
  projectId: string | number,
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
