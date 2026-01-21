/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@open-api-connection/google",
    "@open-api-connection/jira",
    "@open-api-connection/rss",
    "@open-api-connection/monday"
  ],
};

module.exports = nextConfig;
