import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/tests/**/*.test.ts'],
    // Load .env.test so DATABASE_URL points to the test database
    env: {
      NODE_ENV: 'test',
    },
    // Run tests sequentially to avoid cross-test DB race conditions
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Reasonable timeout for DB-backed integration tests
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
