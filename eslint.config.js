import { configs, defineConfig } from '@megahertz/eslint-config';

export default defineConfig(
  configs.base,
  configs.browser,
  configs.sort,
  configs.strict,
  configs.prettier,
  configs.esm,
  configs.unicorn,
);
