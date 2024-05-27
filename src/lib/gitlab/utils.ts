import { Gitlab } from "@gitbeaker/rest";
import { GITLAB_DOMAIN } from "@/lib/appEnv";

export function getApiObject(oauthToken: string) {
  return new Gitlab({
    host: `https://${GITLAB_DOMAIN}`,
    oauthToken: oauthToken,
  });
}
