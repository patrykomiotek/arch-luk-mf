# Ćwiczenie 5 · Komunikacja przez zdarzenia

**35 minut · w parach**

Koszyk w tym repo obsługuje **dodawanie**. Rozbudujcie komunikację tak,
żeby działała w **obie strony** i przetrwała zmianę kontraktu.

## Punkt wyjścia

- kontrakt: [`libs/shared-contracts/src/lib/events.ts`](../../libs/shared-contracts/src/lib/events.ts)
- szyna: [`libs/shared-contracts/src/lib/event-bus.ts`](../../libs/shared-contracts/src/lib/event-bus.ts)
- nadawca: [`apps/flights/src/app/flight-search.ts`](../../apps/flights/src/app/flight-search.ts)
- odbiorca: [`apps/shell/src/app/cart-badge.ts`](../../apps/shell/src/app/cart-badge.ts)

> **Uwaga, na tym się potkniecie:**
> [`libs/shared-contracts/src/index.ts`](../../libs/shared-contracts/src/index.ts)
> ma **jawną listę eksportów**. Dopisanie typu do `events.ts` nie wystarczy -
> trzeba go jeszcze wystawić w `index.ts`, inaczej dostaniecie
> `has no exported member named …`.
>
> To nie jest upierdliwość, tylko sedno: `index.ts` jest **publicznym
> kontraktem** biblioteki. Co nie jest w nim wymienione, jest jej prywatną
> sprawą - dokładnie tak, jak `exposes` w `federation.config.js`.

## Zadanie A · Usuwanie z koszyka (15 min)

1. Dodajcie zdarzenie `ProductRemovedFromCart` do kontraktu
2. Shell pokazuje listę pozycji z przyciskiem „Usuń"
3. Po usunięciu licznik i suma się zgadzają
4. **Test** w `cart-badge.spec.ts` na scenariusz dodaj → dodaj → usuń

## Zadanie B · Wersja 2 kontraktu (15 min) - **tu jest mięso**

Do `ProductAddedToCart` dochodzi pole `currency`. Ale **remote i shell wdraża
się osobno**, więc przez jakiś czas w powietrzu będą obie wersje.

```ts
export type ProductAddedToCartV2 = {
  type: 'product-added-to-cart';
  version: 2;
  payload: { /* … */ currency: 'PLN' | 'EUR' };
};
```

1. Odbiorca ma obsłużyć **obie wersje** naraz
2. Brak `currency` w wersji 1 → domyślnie `'PLN'`
3. **Test** udowadniający, że stary nadawca nadal działa

## Kryteria ukończenia

- [ ] `flights` **nie importuje** niczego z koszyka
- [ ] `shell` **nie importuje** niczego z `flights`
- [ ] Kwoty są w **groszach** na całej drodze
- [ ] Nasłuch jest **odpinany** - potwierdzone testem, nie założone
- [ ] Odbiorca obsługuje wersję 1 **i** 2

## Sprawdźcie zależności

```bash
npm run graph
```

Jeśli na grafie pojawiła się strzałka `shell → flights` albo odwrotnie -
coś poszło nie tak. Powinny łączyć się **tylko** przez `shared-contracts`.
