# Ćwiczenia

Sześć ćwiczeń, w kolejności z warsztatu. Każde ma **kryteria ukończenia** -
jeśli je odhaczysz, ćwiczenie jest zrobione. Bez ściemy.

| # | Ćwiczenie | Czas | Forma |
| --- | --- | --- | --- |
| 1 | [Policz, nie ustawiaj](01-policz-nie-ustawiaj/) | 20 min | w parach |
| 2 | [Stan serwera vs stan klienta](02-stan-serwera/) | 25 min | w parach |
| 3 | [ADR: trzeci mikrofrontend czy biblioteka?](03-adr/) | 25 min | dwie grupy |
| 4 | [Shell ładuje remote](04-shell-remote/) | 40 min | w parach |
| 5 | [Dodaj do koszyka przez zdarzenie](05-zdarzenia/) | 35 min | w parach |
| 6 | [Granice, których pilnuje maszyna](06-granice-nx/) | 35 min | w parach |

## Jak pracujemy

- **W parach.** Jeden pisze, drugi pyta „dlaczego". Zmieniajcie się co 10 minut.
- **Czerwony przed zielonym.** Tam, gdzie jest test, najpierw zobaczcie, jak pada.
- **Nie zdążycie ze wszystkim i to jest OK.** Kryteria są uszeregowane -
  pierwsze są ważniejsze od ostatnich.
- **Utknęliście na 10 minut? Wołajcie.** Utknięcie na konfiguracji niczego nie uczy.

## Zanim zaczniecie

```bash
npm install
npm start          # shell 4200 + flights 4201
npm test           # 6 testów, wszystkie zielone
```

Jeśli coś nie startuje, zawołajcie prowadzącego. Typowe wywrotki przy pierwszym
zestawianiu mikrofrontendów to porty, wersje i CORS.
