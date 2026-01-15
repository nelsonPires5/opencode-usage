import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    envFile: '.env.test',
    globals: false,
    timeout: 15000,
  },
});
