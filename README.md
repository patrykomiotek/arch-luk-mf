# Mikrofrontendy w Angularze - repozytorium warsztatowe

Działający punkt startowy do warsztatu **„Angular, sygnały i mikrofrontendy"**
dla Sieci Badawczej Łukasiewicz. Shell ładuje remote przez **Native Federation**,
a oba komunikują się zdarzeniami.

```bash
npm install
npm start          # shell → http://localhost:4200, flights → :4201
npm test           # 6 testów jednostkowych + 4 architektoniczne
```

Node ≥ 20.19 - sprawdzone na **22.23** i **24.15**. Pierwszy `npm install`
trwa kilka minut.

> Jeśli przełączacie wersję Node między uruchomieniami, demon Nx może zgłosić
> `DB transaction error`. Zadania i tak się wykonują; `npx nx reset` czyści.

> **Kolejność ma znaczenie:** remote musi wstać przed shellem. `npm start`
> robi to za Was; przy ręcznym uruchamianiu najpierw `nx serve flights`.

## Co tu działa

Wejdź na http://localhost:4200/flights i kliknij „Do koszyka" przy dwóch lotach.
Licznik w nagłówku pokaże `🛒 2 · 434,00 zł`.

To jest cała teza warsztatu w jednym kliknięciu:

- lista lotów przyszła z **osobnej aplikacji** na porcie 4201, załadowanej
  w czasie działania,
- `flights` **nie wie**, że koszyk istnieje - opublikował zdarzenie,
- `shell` **nie wie**, skąd przyszło zdarzenie - po prostu go słucha,
- łączy je **wyłącznie typ** z `@mf/contracts`. Sprawdź: `npm run graph`.

## Struktura

```
apps/shell              host: nagłówek, routing, koszyk          :4200
apps/flights            remote: wystawia ./Routes                :4201
libs/shared-contracts   typy zdarzeń + EventBus   (scope:shared, type:util)
libs/shared-ui          komponenty prezentacyjne  (scope:shared, type:ui)

cwiczenia/              zadania - DLA UCZESTNIKÓW
docs/adrs/              cztery decyzje, które trudno odwrócić
docs/lessons/           pułapki, na które naprawdę wpadliśmy
tests/architecture/     reguły egzekwowane maszynowo, nie komentarzem
AGENTS.md               instrukcje dla agentów kodujących
```

## Ćwiczenia

[`cwiczenia/`](cwiczenia/) - sześć zadań w kolejności z warsztatu, każde
z kryteriami ukończenia.

Ćwiczenie 1 startuje **od czerwonego**:

```bash
npm run test:cwiczenia     # 2 failed | 2 passed - i o to chodzi
```

Rozwiązania ma prowadzący. Jeśli utkniecie na dłużej niż dziesięć minut,
wołajcie zamiast szukać po omacku.

Ćwiczenie 6 używa `nx affected`, które porównuje zmiany względem gita. Jeśli
pracujecie na katalogu bez `.git`, zainicjujcie repozytorium - instrukcja jest
w samym ćwiczeniu.

## Decyzje

| ADR | Rzecz |
| --- | --- |
| [001](docs/adrs/001-komunikacja-przez-zdarzenia.md) | Komunikacja przez zdarzenia, nie przez wywołania |
| [002](docs/adrs/002-native-federation.md) | Native Federation, nie webpackowe Module Federation |
| [003](docs/adrs/003-granice-modulow.md) | Mikrofrontend to granica **wdrożenia**, nie granica kodu |
| [004](docs/adrs/004-kwoty-w-groszach.md) | Kwoty w groszach, jako liczby całkowite |

## Wersje

Angular **21.2** · Native Federation **21.2.6** · Nx **23.2** · TypeScript **5.9**
· Vitest **4**.

Native Federation wersjonuje się równolegle z Angularem: linia 21.x pasuje do
Angulara 21, a najnowsza 22.x wymaga już Angulara 22.

W repo jest `.npmrc` z `legacy-peer-deps=true` - bez tego `npm install` wywraca
się na błędzie npm, nie projektu. Szczegóły:
[`docs/lessons/npm-edgesout.md`](docs/lessons/npm-edgesout.md).

## Powiązane

- [`../slajdy-ng-mf`](../slajdy-ng-mf) - slajdy do tego warsztatu
- [`../slajdy-ai-sdlc`](../slajdy-ai-sdlc) - warsztat o `AGENTS.md`, ADR-ach i lekcjach
- [`../angular`](../angular) - przykłady sygnałów i testowalności
