const domainName = process.env.DOMAIN_NAME || "http://localhost:3000";

module.exports = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  SECRET: process.env.NEXTAUTH_SECRET,
  DOMAIN_NAME: domainName,
  NEXTAUTH_URL: domainName,
  GITLAB_CLIENT_ID: process.env.GITLAB_CLIENT_ID || "",
  GITLAB_CLIENT_SECRET: process.env.GITLAB_CLIENT_SECRET || "",
  GITLAB_DOMAIN: process.env.GITLAB_DOMAIN || "gitlab.com",
  GITLAB_PER_PAGE: process.env.GITLAB_PER_PAGE || 50,
  DEFAULT_TITLE: process.env.DEFAULT_TITLE || "EnvEdit",
};
