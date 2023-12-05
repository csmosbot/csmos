const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  redirects: async () => [
    {
      source: "/status",
      destination: "https://csmos.betteruptime.com",
      permanent: false,
    },
  ],
};

module.exports = withNextra(nextConfig);
