/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["./index.js", "plugin:@next/next/recommended"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
};
