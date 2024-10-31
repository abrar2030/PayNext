// .eslintrc.js

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true, // Enables Jest global variables like 'test' and 'expect'
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@eslint/js/recommended",
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true, // Enables JSX parsing
    },
  },
  plugins: [
    "react",
  ],
  settings: {
    react: {
      version: "detect", // Automatically detects the React version
    },
  },
  globals: {
    // Define any additional global variables if necessary
    // e.g., API_KEY: "readonly",
  },
  rules: {
    // Customize your rules here
    "react/prop-types": "off", // Disable PropTypes validation if not using PropTypes
    "no-undef": "off", // Disable if you're defining globals elsewhere
    "react/react-in-jsx-scope": "off", // Disable for React 17+ where importing React is not necessary
    "linebreak-style": ["error", "unix"], // Enforce Unix line endings
    "max-len": ["error", { "code": 80 }], // Enforce maximum line length of 80
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }], // Allow unused variables that start with '_'
    // Add more custom rules as needed
  },
};
