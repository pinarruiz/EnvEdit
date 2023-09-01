const domainName = process.env.DOMAIN_NAME || "http://localhost:3000";

module.exports = {
  SECRET: process.env.SECRET,
  DOMAIN_NAME: domainName,
  NEXTAUTH_URL: domainName,
  GITLAB_CLIENT_ID: process.env.GITLAB_CLIENT_ID || "",
  GITLAB_CLIENT_SECRET: process.env.GITLAB_CLIENT_SECRET || "",
  GITLAB_DOMAIN: process.env.GITLAB_DOMAIN || "gitlab.com",
};
