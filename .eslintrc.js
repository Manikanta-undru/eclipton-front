module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  plugins: ["react", "unused-imports"],
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  rules: {
    "react/prop-types": 0, // Disable prop-types check
    "no-unused-vars": 0, // Disable no-unused-vars rule
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": "off", // Turn off no-unused-vars rule for variables
    "no-useless-escape": 0 // Disable unnecessary escape character rule
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};
