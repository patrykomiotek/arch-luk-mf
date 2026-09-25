import { describe, expect, it } from 'vitest';

import { formatPrice } from './flight';

describe('formatPrice', () => {
  it('zamienia grosze na złotówki z przecinkiem', () => {
    expect(formatPrice(18_900)).toBe('189,00 zł');
  });

  it('nie gubi groszy przy dzieleniu', () => {
    // 1889 gr to 18,89 zł. Gdyby ktoś trzymał kwoty jako float,
    // 18.89 * 100 dałoby 1888.9999999999998.
    expect(formatPrice(1_889)).toBe('18,89 zł');
  });
});
