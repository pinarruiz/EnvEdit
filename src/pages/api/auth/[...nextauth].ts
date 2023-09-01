import NextAuth, { AuthOptions } from "next-auth";
import {
  GITLAB_CLIENT_ID,
  GITLAB_CLIENT_SECRET,
  GITLAB_DOMAIN,
  SECRET,
} from "@/lib/appEnv";
import GitlabProvider from "next-auth/providers/gitlab";

export const authOptions: AuthOptions = {
  secret: SECRET,
  providers: [
    GitlabProvider({
      clientId: GITLAB_CLIENT_ID,
      clientSecret: GITLAB_CLIENT_SECRET,
      authorization: {
        url: `https://${GITLAB_DOMAIN}/oauth/authorize`,
        params: { scope: "read_user" },
      },
      token: `https://${GITLAB_DOMAIN}/oauth/token`,
      userinfo: `https://${GITLAB_DOMAIN}/api/v4/user`,
    }),
  ],
};

export default NextAuth(authOptions);
