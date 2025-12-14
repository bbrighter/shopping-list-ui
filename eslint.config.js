import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  reactHooks.configs.flat.recommended,
  tseslint.configs.recommended,
  reactRefresh.configs.vite,
  js.configs.recommended,
  globalIgnores(['dist', '.dependency-cruiser.cjs']),
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    files: ['**/*.{ts,tsx}'],
    rules: {
      'quotes': ['error', 'single'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'no-console': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'no-undef': 'off',
      'no-unused-vars': ['warn', { "varsIgnorePattern": "^_" }],
      '@typescript-eslint/no-unused-vars': ['warn', { "varsIgnorePattern": "^_" }],
    }
  },
])
