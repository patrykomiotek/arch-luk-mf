# ADR-003: Mikrofrontend to granica wdrożenia, nie granica kodu

**Status:** Zaakceptowany
**Data:** 2026-09-27

## Kontekst

Pokusa jest taka: „wydzielmy X do mikrofrontendu, żeby wymusić porządek
w kodzie". To jest kupowanie kosztów operacyjnych rozproszenia za coś,
co daje lint.

## Rozważane opcje

1. **Nowy mikrofrontend dla każdej większej domeny** - odrzucone. Każdy MF to
   osobne wdrożenie, pipeline, monitoring i kontrakt. Przy jednym zespole
   płacimy pełny koszt bez korzyści.
2. **Biblioteka w monorepo z egzekwowanymi granicami** - wybrane jako domyślne.
3. **Nic nie egzekwujemy, ufamy code review** - odrzucone. Granica utrzymywana
   dobrą wolą znika przy pierwszym pośpiechu.

## Decyzja

**Mikrofrontend wydzielamy wtedy, gdy potrzebny jest niezależny cykl
wydawniczy** - zwykle dlatego, że stoi za nim osobny zespół.

Granice w kodzie egzekwujemy tagami Nx i regułą
`@nx/enforce-module-boundaries`:

| Projekt | `scope` | `type` | Może zależeć od |
| --- | --- | --- | --- |
| `shell` | `shell` | `app` | `scope:shell`, `scope:shared` |
| `flights` | `flights` | `app` | `scope:flights`, `scope:shared` |
| `shared-contracts` | `shared` | `util` | `type:util` |
| `shared-ui` | `shared` | `ui` | `type:ui`, `type:util` |

## Konsekwencje

**Zyskujemy:** tę samą izolację, co osobne repozytoria, bez kosztu osobnych
repozytoriów. Niedozwolony import staje się błędem lintera, a nie tematem
na przegląd.

**Kupujemy świadomie ten koszt:** trzeba utrzymywać tagi i rozumieć regułę.
Nowa osoba zobaczy komunikat lintera, zanim zrozumie, skąd się bierze.

**Uwaga dla uczestników:** reguła nie jest jeszcze skonfigurowana - to jest
**ćwiczenie 6**. Tagi w `project.json` są już na miejscu.
