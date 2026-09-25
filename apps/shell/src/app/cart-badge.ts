import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';

import { EVENT_BUS, type ProductAddedToCart } from '@mf/contracts';

type Pozycja = { productId: string; quantity: number; unitPriceInCents: number };

@Component({
  selector: 'app-cart-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span title="Koszyk">
      🛒 {{ count() }}
      @if (!isEmpty()) {
        <strong>· {{ total() }}</strong>
      }
    </span>
  `,
})
export class CartBadge {
  readonly #bus = inject(EVENT_BUS);

  // JEDNO źródło prawdy. Reszta wynika.
  readonly #items = signal<readonly Pozycja[]>([]);

  readonly count = computed(() =>
    this.#items().reduce((sum, i) => sum + i.quantity, 0),
  );
  readonly isEmpty = computed(() => this.count() === 0);
  readonly total = computed(() => {
    const gr = this.#items().reduce(
      (sum, i) => sum + i.quantity * i.unitPriceInCents,
      0,
    );
    return (gr / 100).toFixed(2).replace('.', ',') + ' zł';
  });

  constructor() {
    const odepnij = this.#bus.on<ProductAddedToCart>(
      'product-added-to-cart',
      (event) =>
        this.#items.update((items) => [...items, event.payload]),
    );
    // Bez tego nasłuch przeżyje komponent. Przy mikrofrontendach
    // ładowanych i odładowywanych w locie to realny wyciek.
    inject(DestroyRef).onDestroy(odepnij);
  }
}
