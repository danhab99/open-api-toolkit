const withTM = require("next-transpile-modules")([
  "@open-api-connection/google",
  "@open-api-connection/jira",
  "@open-api-connection/rss",
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@open-api-connection/google", "@open-api-connection/jira", "@open-api-connection/rss"],
};

module.exports = withTM(nextConfig);
