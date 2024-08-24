import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: {
        ...globals.node, // Include Node.js globals
        ...globals.browser, // If you still need browser globals
      },
      parserOptions: {
        ecmaVersion: 2021, // Set to the ECMAScript version you need
        sourceType: "module", // Use 'script' for CommonJS or 'module' for ES modules
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Example rule
      // Add more rules from 'plugin:react/recommended' manually if needed
    },
  },
];
