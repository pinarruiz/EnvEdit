import { Gitlab } from "@gitbeaker/rest";
import { GITLAB_DOMAIN } from "@/lib/appEnv";

export async function queryProjects(oauthToken: string, page: number = 1) {
  const api = new Gitlab({
    host: `https://${GITLAB_DOMAIN}`,
    oauthToken: oauthToken,
  });
  return await api.Projects.all({
    pagination: "offset",
    showExpanded: true,
    page: page,
  });
}
