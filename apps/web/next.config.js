const { createContentlayerPlugin } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: () => [
    {
      source: "/docs/introduction",
      destination: "/docs",
      permanent: false,
    },
    {
      source: "/invite",
      destination:
        "https://discord.com/api/oauth2/authorize?client_id=1178275478537240626&permissions=1099917502486&scope=bot+applications.commands",
      permanent: false,
    },
    {
      source: "/discord",
      destination: "https://discord.com/invite/q7WNcPakYh",
      permanent: false,
    },
    {
      source: "/status",
      destination: "https://status.csmos.space",
      permanent: false,
    },
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withContentlayer = createContentlayerPlugin({
  // Additional Contentlayer config options
});

module.exports = withContentlayer(nextConfig);
