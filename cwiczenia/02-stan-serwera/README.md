# Ćwiczenie 2 · Stan serwera vs stan klienta

**25 minut · w parach**

## Zadanie

Zbudujcie widok listy lotów z **filtrem** i **zaznaczeniem**. Dane pochodzą
z serwera, filtr i zaznaczenie są Wasze.

Pracujcie w `apps/flights/src/app/` - obok istniejącego `flight-search.ts`.

## Wymagania

1. Lista pobierana **po zmianie filtra**, stare żądanie **anulowane**
2. Widoczny stan **ładowania** i stan **błędu**
3. Zaznaczony wiersz **przeżywa** przeładowanie listy, jeśli nadal istnieje
4. Gdy zaznaczony element zniknął - zaznacz **pierwszy z nowej listy**
5. Reguła „czy lot jest tani" w **osobnym pliku bez importów Angulara** + test

## Podpowiedzi

- punkt 1–2 → `resource` (pamiętajcie o `abortSignal`)
- punkt 3–4 → `linkedSignal` z `previous` - **to jest sedno tego ćwiczenia**
- punkt 5 → czysta funkcja + `describe`/`it`, wzór w `apps/flights/src/app/flight.spec.ts`

Nie macie backendu? Udawajcie go:

```ts
const udawajSerwer = (filtr: string, signal: AbortSignal) =>
  new Promise<Flight[]>((resolve, reject) => {
    const t = setTimeout(
      () => resolve(FLIGHTS.filter((f) => f.to.includes(filtr))),
      400,
    );
    signal.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('Anulowano', 'AbortError'));
    });
  });
```

## Kryteria ukończenia

- [ ] Żaden `effect` nie ustawia sygnału
- [ ] Test reguły przechodzi **bez `TestBed`**
- [ ] Punkt 4 działa - sprawdźcie go, jest podchwytliwy
- [ ] Umiecie wskazać, co jest kopią serwera, a co Waszą własnością

## Uwaga

`resource` ma w Angularze 21.2 status `@experimental`. To nie znaczy „nie używaj",
znaczy „schowaj za własnym portem i wiedz, że API może się ruszyć".
