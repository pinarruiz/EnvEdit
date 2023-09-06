import { GITLAB_DOMAIN } from "@/lib/appEnv";

export async function getUserMe(oauthToken: string) {
  return await (
    await fetch(`https://${GITLAB_DOMAIN}/api/v4/user`, {
      headers: new Headers({ authorization: `Bearer ${oauthToken}` }),
    })
  ).json();
}

export async function isUserLoggedIn(oauthToken: string) {
  return Object.keys(await getUserMe(oauthToken)).includes("id");
}
