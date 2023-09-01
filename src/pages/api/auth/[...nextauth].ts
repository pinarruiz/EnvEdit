import NextAuth, { AuthOptions } from "next-auth";
import {
  GITLAB_CLIENT_ID,
  GITLAB_CLIENT_SECRET,
  GITLAB_DOMAIN,
  NEXTAUTH_SECRET,
} from "@/lib/appEnv";
import GitlabProvider from "next-auth/providers/gitlab";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  secret: NEXTAUTH_SECRET,
  providers: [
    GitlabProvider({
      clientId: GITLAB_CLIENT_ID,
      clientSecret: GITLAB_CLIENT_SECRET,
      authorization: {
        url: `https://${GITLAB_DOMAIN}/oauth/authorize`,
        params: { scope: "read_user api read_api" },
      },
      token: `https://${GITLAB_DOMAIN}/oauth/token`,
      userinfo: `https://${GITLAB_DOMAIN}/api/v4/user`,
    }),
  ],
  callbacks: {
    async jwt(params) {
      if (params.account) {
        if (params.account.provider && !params.token[params.account.provider]) {
          params.token[params.account.provider] = {};
        }
        if (params.account.access_token) {
          (params.token[params.account.provider] as JWT).accessToken =
            params.account.access_token;
        }

        if (params.account.refresh_token) {
          (params.token[params.account.provider] as JWT).refreshToken =
            params.account.refresh_token;
        }
      }
      return params.token;
    },
  },
};

export default NextAuth(authOptions);
