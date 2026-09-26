import { defineConfig } from 'vitest/config';

/** Konfiguracja dla katalogu `cwiczenia/` - uruchamiana osobno od kodu aplikacji. */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['cwiczenia/**/*.spec.ts'],
  },
});
