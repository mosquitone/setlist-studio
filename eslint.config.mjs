import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Core Next.js + TypeScript rules
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    // TypeScript linting
    "plugin:@typescript-eslint/recommended",
    // React and hooks best practices
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    // Accessibility (semantic HTML) rules
    "plugin:jsx-a11y/recommended",
    // Prettier integration (must come last)
    "plugin:prettier/recommended"
  ),
  {
    rules: {
      // Enforce Prettier formatting as ESLint errors
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          semi: false,
          trailingComma: "all",
          printWidth: 100,
          tabWidth: 2,
          arrowParens: "avoid"
        }
      ],
      // TypeScript strictness
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      // React adjustments
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      // Accessibility overrides if needed
      "jsx-a11y/anchor-is-valid": "off"
    },
    settings: {
      react: { version: "detect" }
    }
  }
];
