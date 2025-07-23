import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  // ESLint ignore patterns (migrated from .eslintignore)
  {
    ignores: ['node_modules', '.next', 'out', 'build', 'postgres_data'],
  },
  // Core Next.js + TypeScript rules
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    // TypeScript linting
    'plugin:@typescript-eslint/recommended',
    // React and hooks best practices
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    // Accessibility (semantic HTML) rules
    'plugin:jsx-a11y/recommended',
    // Import order and consistency
    'plugin:import/recommended',
    'plugin:import/typescript',
    // Prettier integration (must come last)
    'plugin:prettier/recommended',
  ),
  {
    rules: {
      // Enforce Prettier formatting as ESLint errors
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          trailingComma: 'all',
          printWidth: 100,
          tabWidth: 2,
          arrowParens: 'always',
        },
      ],
      // Semicolon rules
      semi: ['error', 'always'],
      // TypeScript strictness
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // React adjustments
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // Accessibility overrides if needed
      'jsx-a11y/anchor-is-valid': 'off',
      // Import order rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js built-in modules
            'external', // Packages
            'internal', // Internal modules
            'parent', // Parent directories
            'sibling', // Same directory
            'index', // Index files
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      // Disable overly strict parent import rules for practical Next.js development
      'import/no-relative-parent-imports': 'off',
      // Consistent extensions
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
          js: 'never',
          jsx: 'never',
        },
      ],
      // Prefer combined imports from same package
      'import/no-duplicates': [
        'error',
        {
          'prefer-inline': false,
          considerQueryString: true,
        },
      ],
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'import/internal-regex': '^@/',
    },
  },
];

export default eslintConfig;
