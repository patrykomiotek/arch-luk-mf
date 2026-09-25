/** Kwoty ZAWSZE w groszach - patrz docs/adrs/004. */
export type Flight = {
  id: string;
  from: string;
  to: string;
  priceInCents: number;
};

export const FLIGHTS: readonly Flight[] = [
  { id: 'LO-123', from: 'Warszawa', to: 'Kraków', priceInCents: 18_900 },
  { id: 'LO-456', from: 'Warszawa', to: 'Gdańsk', priceInCents: 24_500 },
  { id: 'LO-789', from: 'Kraków', to: 'Wrocław', priceInCents: 15_000 },
];

/** Czysta funkcja formatująca - testowalna bez Angulara. */
export function formatPrice(priceInCents: number): string {
  return (priceInCents / 100).toFixed(2).replace('.', ',') + ' zł';
}
