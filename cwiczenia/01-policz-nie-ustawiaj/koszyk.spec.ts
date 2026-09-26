import { describe, expect, it } from 'vitest';

import { Koszyk, type Pozycja } from './koszyk';

const lot = (id: string, gr: number): Pozycja => ({
  id,
  quantity: 1,
  unitPriceInCents: gr,
});

describe('Koszyk', () => {
  it('liczy pozycje po dodaniu', () => {
    const k = new Koszyk();
    k.add(lot('A', 18_900));
    expect(k.count()).toBe(1);
  });

  it('sumuje kwoty w groszach', () => {
    const k = new Koszyk();
    k.add(lot('A', 18_900));
    k.add(lot('B', 24_500));
    expect(k.totalInCents()).toBe(43_400);
  });

  // ↓ TE DWA PADAJĄ - bo `remove` aktualizuje tylko jedno pole z czterech
  it('po usunięciu pozycji licznik się zgadza', () => {
    const k = new Koszyk();
    k.add(lot('A', 18_900));
    k.remove('A');
    expect(k.count()).toBe(0);
  });

  it('po usunięciu wszystkiego koszyk jest pusty', () => {
    const k = new Koszyk();
    k.add(lot('A', 18_900));
    k.remove('A');
    expect(k.isEmpty()).toBe(true);
    expect(k.totalInCents()).toBe(0);
  });
});
