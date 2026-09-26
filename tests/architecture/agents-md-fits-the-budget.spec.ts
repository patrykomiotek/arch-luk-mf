import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * `AGENTS.md` musi zmieścić się poniżej `project_doc_max_bytes` Codeksa.
 *
 * Domyślnie to 32 768 bajtów, a treść za tym offsetem jest odcinana
 * **po cichu**: bez ostrzeżenia, bez śladu w diffie. Agent po prostu przestaje
 * wiedzieć o tym, co jest na końcu pliku, a pierwszym objawem jest złamanie
 * reguły, której nigdy nie przeczytał.
 *
 * Padamy kibibajt wcześniej, żeby był czas spokojnie zareagować: przenieść
 * długie wyjaśnienie do `docs/` i zostawić odnośnik. NIE skracać twardych reguł.
 */

const REPO_ROOT = join(import.meta.dirname, '..', '..');

const HARD_LIMIT = 32_768;
const BUDGET = HARD_LIMIT - 1_024;

const PLIKI_INSTRUKCJI = ['AGENTS.md'];

describe('budżet instrukcji dla agentów', () => {
  it.each(PLIKI_INSTRUKCJI)('%s mieści się w budżecie', (plik) => {
    const bajtow = statSync(join(REPO_ROOT, plik)).size;
    expect(bajtow).toBeLessThan(BUDGET);
  });

  it('CLAUDE.md jest tylko wskaźnikiem, nie kopią', () => {
    const tresc = readFileSync(join(REPO_ROOT, 'CLAUDE.md'), 'utf8').trim();
    expect(tresc).toBe('@AGENTS.md');
  });
});
