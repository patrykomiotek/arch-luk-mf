import { describe, expect, it, vi } from 'vitest';

import { EventBus } from './event-bus';
import type { ProductAddedToCart } from './events';

const zdarzenie: ProductAddedToCart = {
  type: 'product-added-to-cart',
  version: 1,
  payload: { productId: 'LOT-1', quantity: 1, unitPriceInCents: 1890 },
};

describe('EventBus', () => {
  it('dostarcza zdarzenie do subskrybenta', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on<ProductAddedToCart>('product-added-to-cart', handler);

    bus.publish(zdarzenie);

    expect(handler).toHaveBeenCalledWith(zdarzenie);
  });

  it('po odpięciu nie dostarcza już nic', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    const odepnij = bus.on<ProductAddedToCart>('product-added-to-cart', handler);

    odepnij();
    bus.publish(zdarzenie);

    expect(handler).not.toHaveBeenCalled();
  });

  it('nie miesza typów zdarzeń', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    bus.on('user-logged-in', handler);

    bus.publish(zdarzenie);

    expect(handler).not.toHaveBeenCalled();
  });
});
