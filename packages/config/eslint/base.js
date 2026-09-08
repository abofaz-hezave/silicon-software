import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

// Plain JS files (e.g. eslint.config.js) are not part of any package's
// tsconfig program, so type-aware rules cannot run on them. Scoping
// disableTypeChecked to JS keeps the strict TS rules everywhere else.
const disableTypeCheckedConfigs = Array.isArray(tseslint.configs.disableTypeChecked)
  ? tseslint.configs.disableTypeChecked
  : [tseslint.configs.disableTypeChecked];
const disableTypeCheckedRules = Object.fromEntries(
  disableTypeCheckedConfigs.flatMap((config) => Object.entries(config.rules ?? {})),
);

/** @type {import('eslint').Linter.Config[]} */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    rules: disableTypeCheckedRules,
  },
  eslintConfigPrettier,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/*.tsbuildinfo',
    ],
  },
  // SST generates infra/sst-env.d.ts with a triple-slash reference to the
  // platform config; that pattern is legitimate in declaration files.
  {
    files: ['**/sst-env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
];
