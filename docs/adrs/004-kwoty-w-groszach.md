# ADR-004: Kwoty trzymamy w groszach, jako liczby całkowite

**Status:** Zaakceptowany i wdrożony
**Data:** 2026-09-27

## Kontekst

Kwoty przechodzą **między mikrofrontendami** w payloadzie zdarzenia. Kontrakt,
w którym „kwota" raz znaczy złotówki, a raz grosze, to najdroższy rodzaj błędu
w architekturze rozproszonej: nie wywala się, tylko po cichu liczy źle.

## Rozważane opcje

1. **Złotówki jako `number`** - odrzucone. `18.9 * 100` daje
   `1889.9999999999998`. Błąd kumuluje się przy sumowaniu koszyka.
2. **Biblioteka do pieniędzy (np. dinero.js)** - odrzucone na tym etapie.
   Dokłada zależność, którą trzeba współdzielić między MF, a problem rozwiązuje
   jedna konwencja.
3. **Grosze jako `number` całkowity** - wybrane.

## Decyzja

Wszędzie **grosze jako liczby całkowite**. Konwersja na złotówki wyłącznie
na wyjściu, w widoku.

**Nazwa pola niesie jednostkę:** `unitPriceInCents`, `priceInCents`,
`totalInCents`. Nigdy samo `price` ani `amount`.

## Konsekwencje

**Zyskujemy:** brak błędów zaokrągleń; jednostka widoczna w autouzupełnianiu,
więc następna osoba nie musi zgadywać.

**Kupujemy świadomie ten koszt:** dzielenie przez 100 w każdym miejscu
prezentacji. Dlatego jest `libs/shared-ui` z komponentem `ui-money`.

**Czym egzekwowane:** niczym automatycznym - na razie konwencją i code review.
To jest dobry kandydat na test architektoniczny.
