import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            react.configs.flat.recommended,
        ],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            react,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            '@typescript-eslint/no-explicit-any': 'off', // Turning off strict any for production polish to avoid massive refactor risk
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            'react/react-in-jsx-scope': 'off',
            'react/forbid-dom-props': 'off', // We heavily use style props for animations
            'react/prop-types': 'off', // Using TS
        },
    },
);
