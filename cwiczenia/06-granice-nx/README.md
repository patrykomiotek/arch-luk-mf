# Ćwiczenie 6 · Granice, których pilnuje maszyna

**35 minut · w parach**

## O co chodzi

Przy jednym zespole granice między modułami utrzymuje dziś **wyłącznie dobra
wola**. Code review łapie je dopóki nikomu się nie spieszy. Celem ćwiczenia
jest przeniesienie tej granicy z dobrej woli do lintera.

To jest tańsza alternatywa dla „wydzielmy to do mikrofrontendu, żeby wymusić
separację" - patrz [ADR-003](../../docs/adrs/003-granice-modulow.md).

---

## Część A · Zobaczcie graf (5 min)

```bash
npm run graph
```

Znajdźcie `shell`, `flights`, `shared-contracts` i `shared-ui`.

> **Pytanie:** czy między `shell` a `flights` jest strzałka? Dlaczego nie?

Sprawdźcie też tagi - to one za chwilę staną się regułami:

```bash
npx nx show project shell --json | python3 -m json.tool | grep -A3 '"tags"'
```

| Projekt | Tagi |
| --- | --- |
| `shell` | `scope:shell`, `type:app` |
| `flights` | `scope:flights`, `type:app` |
| `shared-contracts` | `scope:shared`, `type:util` (+ `npm:private`) |
| `shared-ui` | `scope:shared`, `type:ui` (+ `npm:private`) |

`npm:private` dokłada Nx samo, bo `package.json` bibliotek ma `"private": true`.
Nie piszcie dla niego reguł - nie jest Wasz.

`shared-ui` pokaże się na grafie jako **osobny węzeł bez strzałek**: nic go
jeszcze nie importuje. Istnieje po to, żeby w części C było co naruszyć.

---

## Część B · Złamcie granicę i zobaczcie, że nikt nie reaguje (5 min)

Na początku `apps/shell/src/app/home.ts` dopiszcie:

```ts
import { FLIGHTS } from '../../../flights/src/app/flight';
console.log(FLIGHTS.length);
```

```bash
npx nx lint shell
```

Wynik: **`Successfully ran target lint for project shell`**.

> Shell właśnie sięgnął do wnętrza drugiego mikrofrontendu, a lint to
> przepuścił. **To jest problem, nie sukces.** Od tej chwili obie aplikacje
> trzeba wdrażać razem - i nikt się o tym nie dowie, dopóki coś nie pęknie.

Zostawcie ten import - będzie potrzebny w części C.

---

## Część C · Postawcie strażnika (20 min)

W `eslint.config.mjs` reguła jest **celowo wyłączona**:

```js
'@nx/enforce-module-boundaries': 'off',
```

Zamieńcie ją na konfigurację z `depConstraints`. Szkielet:

```js
'@nx/enforce-module-boundaries': [
  'error',
  {
    enforceBuildableLibDependency: true,
    allow: [],
    depConstraints: [
      { sourceTag: 'scope:shell',
        onlyDependOnLibsWithTags: ['scope:shell', 'scope:shared'] },
      // …dopiszcie resztę
    ],
  },
],
```

Zdefiniujcie ograniczenia dla **wszystkich** tagów: `scope:flights`,
`scope:shared`, `type:app`, `type:ui`, `type:util`.

```bash
npx eslint apps/shell
```

Powinniście zobaczyć:

```
error  Projects cannot be imported by a relative or absolute path,
       and must begin with a npm scope   @nx/enforce-module-boundaries
```

Usuńcie import z części B → lint znów przechodzi.

### Sprawdźcie, czy tagi naprawdę działają

Samo złapanie ścieżki względnej to za mało - to inna reguła. Sprawdźcie
ograniczenie **tagów**. W `libs/shared-contracts/src/index.ts` dopiszcie:

```ts
import { Money } from '@mf/ui';
console.log(Money.name);
```

(Drugą linijkę dopiszcie naprawdę - bez niej dojdzie osobny błąd
o nieużywanej zmiennej i zrobi się szum.)

```bash
npx eslint libs/shared-contracts
```

Oczekiwany komunikat:

```
error  A project tagged with "type:util" can only depend on libs
       tagged with "type:util"   @nx/enforce-module-boundaries
```

Jeśli tego nie widzicie - `depConstraints` dla `type:util` jest źle napisane.
**Nie idźcie dalej, dopóki nie zobaczycie tego komunikatu.** Reguła, której
nikt nie widział na czerwono, zwykle nie działa.

Potem cofnijcie ten import.

---

## Część D · `affected` (5 min)

`nx affected` porównuje zmiany **względem gita**, więc bez repozytorium
odpowie `error: Could not access 'HEAD'`. Jeśli dostaliście katalog bez `.git`:

```bash
git init -q && git add -A && git commit -qm "punkt odniesienia"
```

Potem:

```bash
echo "// dotyk" >> libs/shared-contracts/src/index.ts
npx nx show projects --affected --base=HEAD
```

Wynik: `["shared-contracts", "flights", "shell"]` - zmiana w kontrakcie
dotyka **obu** aplikacji.

Teraz **cofnijcie zmianę i sprawdźcie, że lista jest pusta**, zanim
zrobicie drugi pomiar:

```bash
git checkout libs/shared-contracts/src/index.ts
npx nx show projects --affected --base=HEAD     # []
```

> Ten krok nie jest formalnością. Jeśli go pominiecie, drugi pomiar pokaże
> **sumę obu zmian** i wyjdzie Wam, że `flights` dotyka shella - co jest
> nieprawdą. Łatwo się na tym przejechać.

```bash
echo "// dotyk" >> apps/flights/src/app/flight.ts
npx nx show projects --affected --base=HEAD
```

Wynik: `["flights"]` - zmiana we `flights` **nie dotyka** shella.

Potwierdzenie w grafie (`npm run graph`) - nie ma krawędzi między aplikacjami:

```
flights → shared-contracts
shell   → shared-contracts
```

> **To jest pointa całego bloku.** CI, które buduje i testuje wszystko przy
> każdej zmianie, płaci za rozproszenie i nic z niego nie ma. `affected`
> zamienia graf zależności w oszczędność czasu.

---

## Kryteria ukończenia

- [ ] Widzieliście lint **przechodzący** mimo złamanej granicy (część B)
- [ ] Widzieliście lint **padający** na ścieżce względnej (część C)
- [ ] Widzieliście lint **padający** na ograniczeniu **tagów** (część C)
- [ ] `affected` po zmianie w `shared-contracts` obejmuje obie aplikacje
- [ ] `affected` po zmianie we `flights` **nie** obejmuje shella
- [ ] Umiecie powiedzieć, która komenda trafi do Waszego CI

## Utknęliście?

Gotową konfigurację ma prowadzący. Zanim po nią sięgniecie, sprawdźcie dwie
rzeczy, bo w nich siedzi zwykle cały problem:

- czy w `depConstraints` jest wpis dla **każdego** tagu, łącznie z `type:util`,
- czy uruchamiacie `npx eslint <ścieżka>` na projekcie, który naprawdę łamie
  regułę.

## Puenta

Tagi to **architektura zapisana w pliku**. Jeśli długo spieracie się o to,
jaki tag nadać projektowi - ćwiczenie działa. Ten spór jest rozmową
o architekturze, tylko z konkretnym rozstrzygnięciem na końcu, zamiast
z notatką w Confluence.
