module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  extends: ["@csmos/eslint-config/astro.js"],
  settings: {
    tailwindcss: {
      whitelist: ["scrollbar-hide", "dark"],
    },
  },
};
