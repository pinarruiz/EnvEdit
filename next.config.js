/** @type {import('next').NextConfig} */

const {
  DOMAIN_NAME,
  NEXTAUTH_URL,
  GITLAB_DOMAIN,
  GITLAB_PER_PAGE,
  DEFAULT_TITLE,
} = require("./src/lib/appEnv");

const nextConfig = {
  reactStrictMode: true,
  env: {
    DOMAIN_NAME,
    NEXTAUTH_URL,
    GITLAB_DOMAIN,
    GITLAB_PER_PAGE,
    DEFAULT_TITLE,
  },
};

module.exports = nextConfig;
