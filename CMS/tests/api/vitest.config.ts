import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'tests/api/**/*.spec.ts',
    ],
    testTimeout: 30000,
    hookTimeout: 30000,
    pool: 'threads',
  },
});
