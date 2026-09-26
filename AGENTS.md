# AGENTS.md

Wskazówki dla agentów kodujących pracujących w tym repozytorium. To jest plik
**kanoniczny** - Claude Code, Codex, Cursor i Copilot czytają `AGENTS.md`,
a `CLAUDE.md` to jednolinijkowy import tego pliku. Edytuj ten, nigdy wskaźnika.

> **Budżet instrukcji:** ten plik musi zostać poniżej **32 768 bajtów** -
> domyślnego `project_doc_max_bytes` Codeksa. Treść za tym offsetem **nigdy nie
> dociera do agenta** i nic o tym nie informuje. Pilnuje tego
> `tests/architecture/agents-md-fits-the-budget.spec.ts`, który pada kibibajt
> wcześniej. Gdy zapłonie: przenieś długie wyjaśnienia do `docs/` i zostaw
> odnośnik - **nie skracaj twardych reguł**.

## Komendy

```bash
npm install                 # .npmrc wymusza legacy-peer-deps, patrz lessons
npm start                   # shell (4200) + flights (4201)
npm test                    # THE GATE: testy wszystkich projektów
npm run build               # build wszystkiego
npm run graph               # graf zależności
npm run affected            # tylko projekty dotknięte zmianą

npx nx serve flights        # UWAGA: remote MUSI wstać przed shellem
npx nx test shared-contracts
npx vitest run --config vitest.cwiczenia.config.ts   # testy ćwiczeń
```

## Task Router

Zanim zaczniesz nietrywialne zadanie, dopasuj je do tabeli i przeczytaj
wskazane pliki. Sprawdź też `docs/lessons.md` dla właściwego obszaru, żeby nie
odkrywać znanej pułapki jeszcze raz. Pomiń to przy oczywistych poprawkach.

| Zadanie | Gdzie szukać |
| --- | --- |
| **Federacja** | |
| Wystawienie czegoś z remote'a, zmiana `exposes` | `apps/*/federation.config.js` - to jest **publiczny kontrakt** mikrofrontendu |
| Dodanie remote'a, zmiana adresu | `apps/shell/public/federation.manifest.json` - plik konfiguracyjny, **nie kod**; zmiana nie wymaga przebudowy shella |
| Dlaczego Native Federation, a nie webpack | [ADR-002](docs/adrs/002-native-federation.md) - bo Angular buduje esbuildem |
| Biała strona bez błędu w konsoli | [lessons](docs/lessons.md) - brak `es-module-shims` w `polyfills` |
| Błąd przy budowaniu artefaktów federacji | [lessons](docs/lessons.md) - `shareAll` bierze **wszystko** z `package.json` |
| **Komunikacja** | |
| Nowe zdarzenie między mikrofrontendami | `libs/shared-contracts` - i **zawsze** z polem `version`, patrz [ADR-001](docs/adrs/001-komunikacja-przez-zdarzenia.md) |
| Zmiana kształtu istniejącego zdarzenia | [ADR-001](docs/adrs/001-komunikacja-przez-zdarzenia.md) - odbiorca obsługuje dwie wersje przez jeden cykl wydawniczy |
| Nasłuch zdarzeń w komponencie | `apps/shell/src/app/cart-badge.ts` - `on()` zwraca funkcję odpinającą, wepnij ją w `DestroyRef` |
| **Struktura** | |
| Gdzie umieścić nowy kod: aplikacja czy biblioteka | [ADR-003](docs/adrs/003-granice-modulow.md) - mikrofrontend to granica **wdrożenia**, nie granica kodu |
| Import między projektami | [ADR-003](docs/adrs/003-granice-modulow.md) - `shell` i `flights` łączą się **tylko** przez `scope:shared` |
| Lint, reguła granic modułów | `eslint.config.mjs` - `@nx/enforce-module-boundaries` jest **celowo `off`**, to ćwiczenie 6 |
| Kwoty, ceny, sumy | [ADR-004](docs/adrs/004-kwoty-w-groszach.md) - **grosze jako liczby całkowite**, nazwa pola niesie jednostkę |
| **Materiały warsztatowe** | |
| Zadania dla uczestników | `cwiczenia/` - każde ma własny katalog z README |
| Treść slajdów | repozytorium `../slajdy-ng-mf`, **nie to** |

## Architektura

**Stack:** Angular 21.2 (standalone, zoneless, sygnały) · Native Federation 21.2
· Nx 23 · TypeScript 5.9 · Vitest 4.

```
apps/shell      host - nagłówek, routing, koszyk           :4200
apps/flights    remote - wystawia ./Routes                  :4201
libs/shared-contracts   typy zdarzeń + EventBus  (scope:shared, type:util)
libs/shared-ui          komponenty prezentacyjne (scope:shared, type:ui)
cwiczenia/      zadania dla uczestników
```

`shell` i `flights` **nie importują się nawzajem**. Łączy je wyłącznie kontrakt
zdarzeń z `@mf/contracts`. Sprawdzisz to jednym `npm run graph`.

## Konwencje

Rzeczy, których nie da się wyczytać z kodu:

- **Kwoty zawsze w groszach**, jako liczby całkowite. Nazwa pola niesie
  jednostkę: `unitPriceInCents`, nigdy `price`. Powód: `18.9 * 100` daje
  `1889.9999999999998`.
- **Kod po angielsku, komentarze po polsku.** To materiał szkoleniowy dla
  polskiego zespołu.
- **Jedno źródło prawdy w sygnałach.** Jeśli wartość da się policzyć -
  `computed`, nigdy drugi zapisywalny `signal`. Metryka: ile sygnałów ustawiasz
  na jedno zdarzenie biznesowe.
- **`effect` nie ustawia sygnałów.** Jest do wyjścia na zewnątrz aplikacji.
- **Komponenty prezentacyjne nie wstrzykują serwisów.** Dostają dane wejściem,
  zgłaszają zdarzenia wyjściem - inaczej są nieprzenośne między MF.
- **Każdy `on()` z szyny zdarzeń musi być odpięty.** Mikrofrontendy są
  ładowane i odładowywane w locie; nieodpięty nasłuch to realny wyciek.

## Reguły, które wzięły się z awarii

> **Skrypt typu, którego przeglądarka nie zna, jest ignorowany po cichu.**
> Brak `es-module-shims` w `polyfills` daje białą stronę, HTTP 200 i **pustą
> konsolę**. Diagnoza: `typeof importShim` w konsoli.

> **`shareAll()` bierze wszystko z `package.json` i z `tsconfig` paths.**
> Każdy wpis musi się dać rozwiązać - także ten, którego nie używasz. Mapowanie
> ścieżki do nieistniejącej biblioteki wywraca build federacji.

> **Remote musi wstać przed shellem.** Shell czyta `remoteEntry.json` przy
> pierwszym wejściu na trasę, nie przy starcie.

## Wymagania testowe

| Co | Jaki test |
| --- | --- |
| Czysta funkcja / reguła domenowa | test jednostkowy, **bez `TestBed`** |
| Komponent reagujący na zdarzenia | `TestBed` z podmienionym `EVENT_BUS` przez `providers` |
| Kontrakt zdarzeń | test na **obie** wersje przy zmianie kształtu |
| Kod ćwiczeń | test **padający** przed rozwiązaniem, zielony po |

Podmieniaj zależności przez **token w `providers`**, nie przez `vi.mock`.
Angularowy builder testów i tak odrzuca `vi.mock` dla importów względnych.

## Po zadaniu

1. **Testy** dla nowego kodu.
2. **`npm test`** - bramka obejmująca wszystkie projekty.
3. **`npm run graph`** - jeśli dotykałeś struktury: czy nie pojawiła się
   strzałka `shell → flights`?
4. **Zaloguj lekcję**, jeśli na jakąś trafiłeś - `docs/lessons.md`.
