import nx from '@nx/eslint-plugin';
import tseslint from 'typescript-eslint';

/**
 * Wspólna konfiguracja ESLinta dla całego workspace'u.
 *
 * UWAGA: reguła `@nx/enforce-module-boundaries` jest tu CELOWO WYŁĄCZONA.
 * Jej włączenie i skonfigurowanie to ćwiczenie 6 - patrz
 * `cwiczenia/06-granice-nx/`.
 */
export default tseslint.config(
  {
    ignores: ['**/dist', '**/node_modules', '**/.nx', '**/.angular', '**/tmp'],
  },
  {
    plugins: { '@nx': nx },
  },
  ...tseslint.configs.recommended,
  {
    // `federation.config.js` jest czytany przez builder jako CommonJS,
    // więc `require()` jest tu poprawny, a nie zaniedbanie.
    files: ['**/federation.config.js'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    files: ['**/*.ts'],
    rules: {
      // Granice modułów - ĆWICZENIE 6. Na razie reguła nie pilnuje niczego.
      '@nx/enforce-module-boundaries': 'off',

      'curly': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
);
