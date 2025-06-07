const withTM = require("next-transpile-modules")([
  "@open-api-connection/google",
  // Add all local file: packages here
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@open-api-connection/google"],
};

module.exports = withTM(nextConfig);
