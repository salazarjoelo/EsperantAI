import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['core/**/*.js', 'adapters/**/*.js', 'platforms/**/*.js'],
      exclude: ['core/i18n.js'],
    },
  },
});
