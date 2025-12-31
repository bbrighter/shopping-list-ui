import jseslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
    jseslint.configs.recommended,
    tseslint.configs.recommended,
    stylistic.configs.recommended,
    pluginReactHooks.configs.flat.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            globals: globals.browser,
        },
        plugins: {
            'react': pluginReact,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'quotes': ['error', 'single'],
            'comma-dangle': ['error', 'always-multiline'],
            'object-curly-spacing': ['error', 'always'],
            'no-console': 'warn',
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'simple-import-sort/imports': 'warn',
            'simple-import-sort/exports': 'error',
            'indent': 'off',
            '@stylistic/indent': ['error', 4],
            '@stylistic/jsx-indent-props': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
])
