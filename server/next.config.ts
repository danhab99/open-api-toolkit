const withTM = require("next-transpile-modules")([
  "@open-api-connection/google",
  "@open-api-connection/rss",
  // Add all local file: packages here
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@open-api-connection/google", "@open-api-connection/rss"],
};

module.exports = withTM(nextConfig);
