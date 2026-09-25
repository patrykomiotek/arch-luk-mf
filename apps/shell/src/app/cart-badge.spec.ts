import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { EVENT_BUS, EventBus, type ProductAddedToCart } from '@mf/contracts';

import { CartBadge } from './cart-badge';

const lot = (priceInCents: number): ProductAddedToCart => ({
  type: 'product-added-to-cart',
  version: 1,
  payload: { productId: 'LO-1', quantity: 1, unitPriceInCents: priceInCents },
});

describe('CartBadge', () => {
  it('reaguje na zdarzenie z innego mikrofrontendu', () => {
    const bus = new EventBus();
    TestBed.configureTestingModule({
      providers: [{ provide: EVENT_BUS, useValue: bus }],
    });
    const fixture = TestBed.createComponent(CartBadge);
    fixture.detectChanges();

    expect(fixture.componentInstance.count()).toBe(0);

    bus.publish(lot(18_900));
    bus.publish(lot(24_500));

    expect(fixture.componentInstance.count()).toBe(2);
    expect(fixture.componentInstance.total()).toBe('434,00 zł');
  });
});
