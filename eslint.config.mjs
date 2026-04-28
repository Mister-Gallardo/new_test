import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import reactCompiler from 'eslint-plugin-react-compiler'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    plugins: {
      'react-compiler': reactCompiler,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.mjs', 'eslint.config.mjs'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'react-compiler/react-compiler': 'error',

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. env imports first
            ['^.+/env(\\..*)?$'],
            // 2. Side effect imports (e.g., polyfills)
            ['^\\u0000'],
            // 3. Node.js builtins
            ['^node:'],
            // 4. React imports
            ['^react$', '^react-dom$', '^react/.*$'],
            // 5. External packages
            ['^@?\\w'],
            // 6. Internal packages (aliases starting with @/ or ~)
            ['^@/', '^~'],
            // 7. Parent imports (../)
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // 8. Sibling imports (./)
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // 9. Style imports at the end
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-new': 'off',
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    },
  },
])

export default eslintConfig
