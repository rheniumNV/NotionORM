module.exports = {
  env: {
    browser: false,
    es2021: true,
    "jest/globals": true,
  },
  extends: ["standard", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "eslint-plugin-jest"],
  rules: {},
};
