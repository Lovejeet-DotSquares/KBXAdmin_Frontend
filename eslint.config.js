import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  /* ---------- IGNORE ---------- */
  globalIgnores(["dist", "build", "node_modules"]),

  {
    files: ["**/*.{ts,tsx}"],

    /* ---------- BASE CONFIGS ---------- */
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended, // spread is IMPORTANT
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    /* ---------- LANGUAGE ---------- */
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    /* ---------- RULES ---------- */
    rules: {
      /* ✅ allow `any` */
      "@typescript-eslint/no-explicit-any": "off",
      "no-debugger": "off",
      "react-hooks/exhaustive-deps": "off",
      /* 🔥 avoid noise in React + TS */
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "warn",
        {
          "ts-ignore": "allow-with-description",
        },
      ],

      /* React */
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      /* Hooks safety */
      "react-hooks/rules-of-hooks": "error",
    },
  },
]);
