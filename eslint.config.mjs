import { configs, defineConfig } from '@megahertz/eslint-config';

export default defineConfig(
  configs.base,
  configs.browser,
  configs.sort,
  configs.strict,
  configs.prettier,
  configs.unicorn,

  {
    files: ['src/**/*.js'],
    languageOptions: {
      sourceType: 'script',
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'strict': ['error', 'global'],
    },
  },
);
