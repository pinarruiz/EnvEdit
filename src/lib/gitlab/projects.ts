import { SimpleProjectSchema } from "@gitbeaker/rest";
import { GITLAB_PER_PAGE } from "@/lib/appEnv";
import { getApiObject } from "@/lib/gitlab/utils";

export async function queryProjects(oauthToken: string, page: number = 1) {
  return await getApiObject(oauthToken).Projects.all({
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
  return await getApiObject(oauthToken).Projects.show(projectId);
}
