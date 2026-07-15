const globals = require('globals');
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const reactRefresh = require('eslint-plugin-react-refresh');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    ignores: [
      '**/dist',
      '**/node_modules',
      '**/*.config.js',
      '**/*.config.cjs',
      '**/.eslintrc.*',
      '**/coverage',
      '**/.vite',
    ],
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefresh,
      prettier: prettierPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',

      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  {
    files: ['client/**/*.{ts,tsx,js,jsx}'],
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },

  {
    files: ['server/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
];
