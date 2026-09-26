import { signal } from '@angular/core';

export type Pozycja = {
  id: string;
  quantity: number;
  unitPriceInCents: number;
};

/**
 * ZADANIE: ta klasa robi cztery zapisy na jedno zdarzenie biznesowe.
 * Każdy z nich to miejsce, w którym stan może się rozjechać - i właśnie
 * dlatego dwa testy padają.
 *
 * Przepiszcie ją tak, żeby `items` było jedynym zapisywalnym sygnałem.
 */
export class Koszyk {
  readonly items = signal<Pozycja[]>([]);

  // ✗ wszystkie trzy poniżej DA SIĘ POLICZYĆ z `items`
  readonly count = signal(0);
  readonly totalInCents = signal(0);
  readonly isEmpty = signal(true);

  add(pozycja: Pozycja): void {
    this.items.update((x) => [...x, pozycja]);
    this.count.set(this.items().length);
    this.totalInCents.set(
      this.items().reduce((s, i) => s + i.quantity * i.unitPriceInCents, 0),
    );
    this.isEmpty.set(false);
  }

  remove(id: string): void {
    this.items.update((x) => x.filter((i) => i.id !== id));
    // ✗ ktoś zapomniał zaktualizować resztę - i o to chodzi
  }
}
