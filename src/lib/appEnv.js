const nextauthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

module.exports = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  SECRET: process.env.NEXTAUTH_SECRET,
  DOMAIN_NAME: nextauthUrl,
  NEXTAUTH_URL: nextauthUrl,
  GITLAB_CLIENT_ID: process.env.GITLAB_CLIENT_ID || "",
  GITLAB_CLIENT_SECRET: process.env.GITLAB_CLIENT_SECRET || "",
  GITLAB_DOMAIN:
    process.env.GITLAB_DOMAIN || process.env.CI_SERVER_HOST || "gitlab.com",
  GITLAB_PER_PAGE: process.env.GITLAB_PER_PAGE || "50",
  DEFAULT_TITLE: process.env.DEFAULT_TITLE || "EnvEdit",
};
