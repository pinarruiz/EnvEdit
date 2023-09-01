/** @type {import('next').NextConfig} */

const appEnv = require("./src/lib/appEnv");

const nextConfig = {
  reactStrictMode: true,
  env: appEnv,
};

module.exports = nextConfig;
