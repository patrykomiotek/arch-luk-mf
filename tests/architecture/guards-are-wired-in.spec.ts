import { globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * Dwa testy na to samo pytanie: czy reguła jest WPIĘTA, a nie tylko napisana.
 *
 * Powód, dla którego ten plik w ogóle istnieje: kod, który jest poprawny
 * i ma własne testy jednostkowe, potrafi nie być wołany przez nikogo.
 * Wszystkie sprawdzenia świecą wtedy na zielono, a system i tak nie ma
 * tej właściwości, o której myślicie, że ją ma.
 *
 * Oba testy czytają kod jako TEKST. To celowe: nie interesuje nas,
 * czy coś się kompiluje, tylko czy w repozytorium istnieje miejsce wywołania.
 */

const REPO_ROOT = join(import.meta.dirname, '..', '..');

/** Cały kod produkcyjny aplikacji i bibliotek. Testy nas tu nie interesują. */
const SOURCES = globSync('{apps,libs}/**/*.ts', {
  cwd: REPO_ROOT,
  exclude: (path) => path.includes('.spec.') || path.includes('node_modules'),
});

const read = (file: string) => readFileSync(join(REPO_ROOT, file), 'utf8');

describe('reguły są wpięte, nie tylko napisane', () => {
  // Strażnik strażnika. Gdyby glob przestał cokolwiek znajdować - na przykład
  // po przeniesieniu katalogów - oba testy niżej przechodziłyby zawsze
  // i nie pilnowały niczego. Fałszywa zieloność jest droższa niż brak testu.
  it('widzi kod źródłowy, który ma sprawdzać', () => {
    expect(SOURCES.length).toBeGreaterThan(5);
  });

  /**
   * `EventBus.on()` zwraca funkcję odpinającą i ma na to własne testy
   * (`event-bus.spec.ts`). Te testy nie powiedzą jednak nic o tym, czy ktoś
   * tę funkcję woła. Przy mikrofrontendach ładowanych i odładowywanych
   * w trakcie nawigacji nieodpięty nasłuch to wyciek, który widać dopiero
   * po godzinie pracy - czyli nigdy na demie.
   */
  it('każdy nasłuch na szynie zdarzeń ma miejsce odpięcia', () => {
    const subscribers = SOURCES.filter((file) => read(file).match(/\.on</));

    // Jeśli nikt nie subskrybuje, ten test niczego nie dowodzi.
    expect(subscribers.length).toBeGreaterThan(0);

    const offenders = subscribers.filter(
      (file) => !read(file).match(/onDestroy\(/),
    );

    expect(offenders).toEqual([]);
  });

  /**
   * ADR-004: kwoty trzymamy w groszach jako liczby całkowite, a zamiana
   * na złotówki należy wyłącznie do komponentu `Money` z `@mf/ui`.
   *
   * Komponent istnieje, jest poprawny i ma jedno zadanie. Pytanie brzmi,
   * czy ktokolwiek go używa - bo jeśli nie, to reguła „formatujemy w jednym
   * miejscu" jest wyłącznie deklaracją, a każda kopia formatowania rozjedzie
   * się z resztą przy pierwszej zmianie waluty albo separatora.
   */
  const MONEY_COMPONENT = join('libs', 'shared-ui', 'src', 'lib', 'money.ts');

  it('grosze na złotówki zamienia wyłącznie komponent Money', () => {
    const offenders = SOURCES.filter(
      (file) => file !== MONEY_COMPONENT && read(file).match(/\/ 100\)\.toFixed\(/),
    );

    expect(offenders).toEqual([]);
  });
});
