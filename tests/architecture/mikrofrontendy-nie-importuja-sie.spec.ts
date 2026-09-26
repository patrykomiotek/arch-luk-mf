import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * Reguła z ADR-001 i ADR-003: `shell` i `flights` komunikują się wyłącznie
 * przez zdarzenia z `@mf/contracts`. Żadne z nich nie importuje kodu drugiego.
 *
 * Dlaczego test, a nie komentarz: import „na skróty" jest jedną linijką, która
 * przechodzi typecheck i wszystkie testy jednostkowe, a niszczy jedyną korzyść
 * z rozdzielenia tych aplikacji - możliwość wdrażania ich osobno.
 *
 * UWAGA na pierwszą wersję tego testu: szukała ciągu `apps/flights` w treści
 * importu i **przepuszczała** `from '../../../flights/src/app/flight'`, czyli
 * najbardziej prawdopodobną postać naruszenia. Dlatego ścieżki względne są tu
 * realnie rozwiązywane, a nie dopasowywane wzorcem.
 */

const REPO_ROOT = join(import.meta.dirname, '..', '..');

function plikiTs(katalog: string): string[] {
  const wynik: string[] = [];
  for (const wpis of readdirSync(katalog)) {
    const sciezka = join(katalog, wpis);
    if (statSync(sciezka).isDirectory()) {
      wynik.push(...plikiTs(sciezka));
    } else if (wpis.endsWith('.ts')) {
      wynik.push(sciezka);
    }
  }
  return wynik;
}

/** Wyciąga specyfikatory ze wszystkich `import ... from '…'` i `import('…')`. */
function specyfikatory(tresc: string): string[] {
  const out: string[] = [];
  const wzorce = [/from\s+['"]([^'"]+)['"]/g, /import\(\s*['"]([^'"]+)['"]\s*\)/g];
  for (const wzorzec of wzorce) {
    for (const m of tresc.matchAll(wzorzec)) out.push(m[1]!);
  }
  return out;
}

const PARY = [
  { aplikacja: 'shell', zakazany: 'flights' },
  { aplikacja: 'flights', zakazany: 'shell' },
] as const;

describe('granice między mikrofrontendami', () => {
  it.each(PARY)(
    '$aplikacja nie importuje niczego z $zakazany',
    ({ aplikacja, zakazany }) => {
      const katalogZakazany = join(REPO_ROOT, 'apps', zakazany) + sep;
      const pliki = plikiTs(join(REPO_ROOT, 'apps', aplikacja, 'src'));

      // Strażnik strażnika: pusta lista plików sprawiłaby, że test przechodzi
      // zawsze i niczego nie pilnuje.
      expect(pliki.length).toBeGreaterThan(0);

      const winowajcy: string[] = [];
      for (const plik of pliki) {
        for (const spec of specyfikatory(readFileSync(plik, 'utf8'))) {
          const wskazujeNaZakazany = spec.startsWith('.')
            ? resolve(dirname(plik), spec).startsWith(katalogZakazany)
            : spec.includes(`apps/${zakazany}`);
          if (wskazujeNaZakazany) {
            winowajcy.push(`${relative(REPO_ROOT, plik)} → ${spec}`);
          }
        }
      }

      expect(winowajcy).toEqual([]);
    },
  );
});
