# Ćwiczenie 4 · Shell ładuje remote

**40 minut · w parach**

To repozytorium **już działa** - `shell` ładuje `flights`. Celem ćwiczenia nie
jest odtworzenie tego od zera, tylko **zrozumienie, gdzie są szwy**, przez
rozmontowanie i złożenie z powrotem.

## Część A · Zobaczcie, jak to działa (10 min)

```bash
npm start
```

1. Otwórz http://localhost:4201/remoteEntry.json - **to jest cały kontrakt**
   remote'a. Znajdźcie w nim `exposes` i policzcie `shared`.
2. Otwórz http://localhost:4200/flights, DevTools → **Network**.
   Znajdźcie pliki ładowane z **portu 4201**.
3. Otwórz http://localhost:4200/federation.manifest.json

> **Pytanie:** co się stanie, gdy zmienicie adres w manifeście?
> Czy trzeba przebudować shella?

## Część B · Dodajcie drugi remote (20 min)

Dodajcie aplikację `hotels`, która wystawia własne trasy.

1. Skopiujcie strukturę `apps/flights` → `apps/hotels`
2. W `apps/hotels/federation.config.js`:
   - `name` → `hotels`
   - **i `exposes` → `./apps/hotels/src/app/…`** ← o tym łatwo zapomnieć
3. W `apps/hotels/project.json` zamieńcie **każde** `flights` na `hotels`
   i port `4201` na `4202`
4. Dopiszcie wpis do `apps/shell/public/federation.manifest.json`
5. Dopiszcie trasę w `apps/shell/src/app/app.routes.ts`
6. Dopiszcie link w nagłówku `apps/shell/src/app/app.ts`

> **Krok 2 jest pułapką i to celowo.** Ścieżki w `exposes` są liczone
> **od korzenia workspace’u**, nie od katalogu aplikacji. Jeśli zostawicie
> `./apps/flights/...`, build padnie komunikatem o pliku, którego wcale
> nie szukacie:
>
> ```
> ERROR: File 'apps/flights/src/app/flight-search.ts'
>        not found in TypeScript compilation
> ```
>
> To jest dobry moment, żeby zapamiętać: **`exposes` to publiczny kontrakt
> mikrofrontendu** i trzeba go czytać uważnie, a nie kopiować bezmyślnie.

### Posprzątajcie po kopiowaniu

Skopiowana aplikacja ma nazwy z `flights` w środku - `flights.routes.ts`,
`FLIGHT_ROUTES`, `app-flight-search`. Zmieńcie je na hotelowe. To nie jest
kosmetyka: dwa komponenty o tym samym selektorze w jednej stronie to
kłopot, którego nie chcecie diagnozować na produkcji.

Sprawdzian po drodze:

```bash
npx nx build hotels
python3 -c "import json;print(json.load(open('dist/apps/hotels/browser/remoteEntry.json'))['name'])"
# hotels
```

## Część C · Zepsujcie to (10 min) - **najważniejsza część**

1. **Zabijcie `flights`** (Ctrl+C w jego terminalu)
2. Odświeżcie http://localhost:4200/flights

> **Co widzi użytkownik?** Czy padła cała aplikacja, czy tylko ta sekcja?
> Czy nagłówek i koszyk nadal działają? Czy da się przejść na inną trasę?

3. Wróćcie na `/` i sprawdźcie, czy shell żyje.
4. Otwórzcie **konsolę** i znajdźcie komunikat.

### Co się dzieje naprawdę (sprawdzone)

| | |
| --- | --- |
| Shell | **startuje normalnie** - nagłówek, nawigacja i koszyk działają |
| Kliknięcie „Loty” | **nie robi NIC** - URL się nie zmienia, nie ma komunikatu |
| Konsola przy starcie | `Error loading remote entry for flights` + `TypeError: Failed to fetch` |
| Konsola po kliknięciu | `ERROR Error: unknown remote flights` |
| Po wznowieniu remote’a | wszystko wraca bez restartu shella |

Zwróćcie uwagę na drugi wiersz. **To jest najgorszy możliwy wariant dla
użytkownika:** nie widzi błędu, nie widzi pustej strony, nie widzi nic.
Klika i ma wrażenie, że aplikacja go ignoruje.

### Zadanie dodatkowe (jeśli zostanie czas)

Zróbcie tak, żeby użytkownik **coś zobaczył**. Najprostsza wersja: opakujcie
`loadRemoteModule` i przy błędzie pokażcie komponent z komunikatem zamiast
milczenia.

```ts
loadChildren: () =>
  loadRemoteModule('flights', './Routes')
    .then((m) => m.FLIGHT_ROUTES)
    .catch(() => [
      {
        path: '',
        loadComponent: () =>
          import('./remote-niedostepny')
            .then((m) => m.RemoteNiedostepny),
      },
    ]),
```

## Kryteria ukończenia

- [ ] Trasa z drugiego remote'a działa w shellu
- [ ] Adresy remote'ów są **w manifeście**, nie w kodzie
- [ ] Zmiana adresu **nie wymaga** przebudowy shella - sprawdziliście to
- [ ] Umiecie **opisać słowami**, co widzi użytkownik przy niedostępnym remote
- [ ] Wiecie, że odpowiedź brzmi **„nic”** - i dlaczego to jest gorsze niż błąd

## Puenta części C

Większość zespołów odkrywa brak obsługi niedostępnego remote'a dopiero
na produkcji. Jeśli padła cała aplikacja - nie macie izolacji awarii,
macie **rozproszony monolit z dodatkowym punktem awarii**.

Wracamy do tego w bloku o utrzymaniu.
