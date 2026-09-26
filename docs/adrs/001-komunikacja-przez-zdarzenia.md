# ADR-001: Mikrofrontendy komunikują się przez zdarzenia, nie przez wywołania

**Status:** Zaakceptowany i wdrożony
**Data:** 2026-09-27

## Kontekst

`flights` musi poinformować koszyk, że użytkownik dodał lot. Koszyk żyje
w `shell`. Obie aplikacje wdraża się niezależnie.

## Rozważane opcje

1. **Bezpośrednie wywołanie funkcji z koszyka** - odrzucone. `flights`
   musiałby importować kod koszyka, co daje zależność w buildzie i wymusza
   wspólne wdrożenie. To jest dokładnie to, czego mikrofrontendy mają uniknąć.
2. **Współdzielony store (np. sygnał w `shared`)** - odrzucone. Dwa zespoły
   posiadałyby wtedy jedną strukturę stanu i żaden nie mógłby jej zmienić sam.
3. **Zdarzenia przez wspólną szynę** - wybrane.

## Decyzja

Mikrofrontendy publikują **zdarzenia**. Nadawca nie wie, kto słucha.

Każde zdarzenie niesie pole **`version`**. Odbiorca, który dostanie nieznaną
wersję, ma ją obsłużyć albo świadomie zignorować - nigdy się nie wywrócić.

Szyna opiera się na `EventTarget`, czyli standardzie przeglądarki, a nie na
RxJS. Powód: zero zależności, więc działa niezależnie od tego, czy drugi
mikrofrontend ma RxJS i w jakiej wersji.

## Konsekwencje

**Zyskujemy:** odbiorca może się zmienić, zniknąć albo dojść bez zmiany
u nadawcy. `npm run graph` pokazuje brak strzałki `shell ↔ flights`.

**Kupujemy świadomie ten koszt:** przepływ jest trudniejszy do prześledzenia
w debugerze niż wywołanie funkcji. Nie ma kompilatora, który powie „nikt nie
słucha tego zdarzenia".

**Czym egzekwowane:** `tests/architecture/mikrofrontendy-nie-importuja-sie.spec.ts`
