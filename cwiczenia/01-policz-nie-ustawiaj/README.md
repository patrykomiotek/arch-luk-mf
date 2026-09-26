# Ćwiczenie 1 · Policz, nie ustawiaj

**20 minut · w parach**

## Zadanie

W pliku [`koszyk.ts`](koszyk.ts) jest klasa, która obsługuje koszyk **źle**:
na jedno zdarzenie biznesowe robi **cztery zapisy**. Testy w
[`koszyk.spec.ts`](koszyk.spec.ts) to udowadniają - dwa z nich **padają**.

Przepiszcie ją tak, żeby zostało **jedno źródło prawdy**, a reszta była
`computed`.

## Start

```bash
npx vitest run cwiczenia/01-policz-nie-ustawiaj
```

Zobaczcie **czerwone**, zanim zaczniecie. To jest punkt wyjścia.

## Kroki

1. Wypiszcie na kartce wszystkie pola stanu tej klasy
2. Przy każdym zaznaczcie: *ustawiane z zewnątrz* czy *wynikające z innych*
3. Wszystko, co wynika → `computed`
4. Policzcie zapisy na jedno zdarzenie **przed** i **po**

## Kryteria ukończenia

- [ ] Wszystkie testy zielone
- [ ] W klasie jest **dokładnie jeden** zapisywalny `signal`
- [ ] Żaden `effect` nie ustawia sygnału
- [ ] Potraficie powiedzieć, ile zapisów ubyło

## Jeśli skończycie wcześniej

Weźcie komponent **z własnego projektu** i zróbcie z nim to samo. To jest
właściwa wersja tego ćwiczenia - powyższy koszyk to tylko rozbieg.
