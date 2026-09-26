# Lekcje

Katalog nieoczywistych pułapek, zaindeksowany tak, żeby agent (albo człowiek)
sprawdził właściwy obszar **przed** rozpoczęciem pracy, zamiast odkrywać ten sam
błąd jeszcze raz.

## Jak korzystać

Przed nietrywialnym zadaniem przejrzyj bullety z obszaru, którego dotyczy -
**nie cały katalog**. Każdy plik ma cztery stałe sekcje: Kontekst, Problem,
Reguła, Dotyczy.

## Katalog

### federacja

- [Skrypt typu, którego przeglądarka nie zna, jest ignorowany po cichu](lessons/brak-es-module-shims.md)
  - area:federacja; topic:native-federation,polyfills,fail-silent.
  Brak `es-module-shims` w `polyfills` daje **białą stronę, HTTP 200 i pustą
  konsolę**. Przeglądarka nie zna typu `module-shim`, więc pomija skrypt bez
  słowa. Diagnoza w 5 sekund: `typeof importShim` w konsoli.

- [`shareAll()` bierze wszystko z package.json i z tsconfig paths, także to, czego nie używasz](lessons/shareall-bierze-wszystko.md)
  - area:federacja; topic:native-federation,shared,build.
  Build federacji pada na pakiecie, którego nigdzie nie importujesz - bo
  `shareAll` czyta **deklaracje**, nie użycia. Dopisanie do `skip` nie pomaga,
  gdy odwołanie siedzi w środku innego współdzielonego pakietu.

### narzędzia

- [`npm install` wywraca się na `edgesOut` i to nie jest błąd projektu](lessons/npm-edgesout.md)
  - area:narzędzia; topic:npm,peer-dependencies.
  `Cannot read properties of null (reading 'edgesOut')` to błąd arborista przy
  rozwiązywaniu konfliktu peer dependencies. Obejście: `legacy-peer-deps`.

## Dopisywanie lekcji

Po nietrywialnej korekcie albo nieoczywistej pułapce:

1. Sprawdź, czy istniejąca lekcja już tego nie pokrywa - rozszerz ją zamiast
   tworzyć bliźniaka.
2. Dodaj plik `docs/lessons/<slug>.md` w czterech sekcjach.
3. Dodaj **jeden bullet** do właściwej sekcji wyżej.

Tytuł lekcji jest **zdaniem orzekającym**, nie tematem. Sprawdzian: czy ktoś
po przeczytaniu samego tytułu wie, czego unikać?
