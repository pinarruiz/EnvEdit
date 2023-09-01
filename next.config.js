/** @type {import('next').NextConfig} */

const appEnv = require("./lib/appEnv");

const nextConfig = {
  reactStrictMode: true,
  env: appEnv,
};

module.exports = nextConfig;
