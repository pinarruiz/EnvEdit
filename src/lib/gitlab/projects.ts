import { Gitlab, SimpleProjectSchema } from "@gitbeaker/rest";
import { GITLAB_DOMAIN, GITLAB_PER_PAGE } from "@/lib/appEnv";

export async function queryProjects(oauthToken: string, page: number = 1) {
  const api = new Gitlab({
    host: `https://${GITLAB_DOMAIN}`,
    oauthToken: oauthToken,
  });
  return await api.Projects.all({
    pagination: "offset",
    showExpanded: true,
    page: page,
    simple: true,
    perPage: GITLAB_PER_PAGE,
  });
}

export async function getProject(
  oauthToken: string,
  projectId: SimpleProjectSchema["id"],
) {
  const api = new Gitlab({
    host: `https://${GITLAB_DOMAIN}`,
    oauthToken: oauthToken,
  });
  return await api.Projects.show(projectId);
}
