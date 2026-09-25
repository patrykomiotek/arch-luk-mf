import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { EVENT_BUS, type ProductAddedToCart } from '@mf/contracts';

import { FLIGHTS, formatPrice, type Flight } from './flight';

@Component({
  selector: 'app-flight-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Loty</h2>
    <ul style="list-style:none;padding:0;max-width:34rem">
      @for (flight of flights(); track flight.id) {
        <li style="display:flex;gap:1rem;align-items:center;
                   padding:.6rem 0;border-bottom:1px solid var(--line)">
          <span style="flex:1">{{ flight.from }} → {{ flight.to }}</span>
          <strong>{{ price(flight) }}</strong>
          <button type="button" (click)="add(flight)">Do koszyka</button>
        </li>
      }
    </ul>
  `,
})
export class FlightSearch {
  readonly #bus = inject(EVENT_BUS);
  readonly flights = signal<readonly Flight[]>(FLIGHTS);

  price(flight: Flight): string {
    return formatPrice(flight.priceInCents);
  }

  /**
   * Flights NIE wie, że koszyk istnieje. Publikuje zdarzenie i tyle.
   * Dzięki temu odbiorca może się zmienić, zniknąć albo dojść -
   * bez żadnej zmiany tutaj.
   */
  add(flight: Flight): void {
    this.#bus.publish<ProductAddedToCart>({
      type: 'product-added-to-cart',
      version: 1,
      payload: {
        productId: flight.id,
        quantity: 1,
        unitPriceInCents: flight.priceInCents,
      },
    });
  }
}
