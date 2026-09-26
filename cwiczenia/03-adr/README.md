# Ćwiczenie 3 · ADR: trzeci mikrofrontend czy biblioteka?

**25 minut · dwie grupy, potem konfrontacja**

## Zadanie

Napiszcie **ADR** dla najbliższej realnej zmiany w Waszej aplikacji.

- **Grupa A** broni stanowiska „nowy mikrofrontend"
- **Grupa B** broni stanowiska „moduł w monorepo"

Wybierzcie temat z własnego projektu, nie wymyślony.

## Szablon

Skopiujcie [`szablon.md`](szablon.md) do `docs/adrs/` i wypełnijcie.

## Musi paść odpowiedź na

- [ ] Który z **pięciu driverów** to uzasadnia? (wdrożenia / skalowalność
      organizacyjna / elastyczność technologiczna / odporność / utrzymanie)
- [ ] **Ilu zespołów** dotyczy ta granica?
- [ ] Jaki jest **niezależny cykl wydawniczy** tej części?
- [ ] Co **zmierzycie** za trzy miesiące, żeby wiedzieć, czy decyzja była dobra?
- [ ] Jaki koszt **kupujecie świadomie**?

## Na co zwrócić uwagę przy konfrontacji

Nie ma jednej dobrej odpowiedzi. Jest za to jedno dobre **pytanie**:

> Czy ta granica ma **własny zespół i własny cykl wydawniczy**?

Jeśli nie - to jest kandydat na bibliotekę w Nx, nie na mikrofrontend.
Mikrofrontend wydzielacie wtedy, gdy potrzebujecie osobnego **wdrożenia**,
a nie wtedy, gdy chcecie wymusić granicę w kodzie. Granicę w kodzie
daje lint - taniej i bez kosztów operacyjnych (ćwiczenie 6).

## Produkt ćwiczenia

Na koniec **nie ogłaszamy zwycięzcy**. Każda grupa wskazuje **jeden warunek**,
po którego spełnieniu zmieniłaby zdanie. To jest prawdziwy wynik.
