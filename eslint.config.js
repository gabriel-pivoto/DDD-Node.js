const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const prettierPlugin = require("eslint-plugin-prettier");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");
const sortDestructureKeysPlugin = require("eslint-plugin-sort-destructure-keys");
const sortKeysFixPlugin = require("eslint-plugin-sort-keys-fix");

module.exports = [
  {
    ignores: ["dist/**", "build/**", "coverage/**", "node_modules/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
      "unused-imports": unusedImportsPlugin,
      "sort-destructure-keys": sortDestructureKeysPlugin,
      "sort-keys-fix": sortKeysFixPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "prettier/prettier": ["error", { semi: false }],
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "sort-destructure-keys/sort-destructure-keys": "error",
      "sort-keys-fix/sort-keys-fix": ["error", "asc", { caseSensitive: true }],
    },
  },
];
