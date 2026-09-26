# ADR-002: Używamy Native Federation, nie webpackowego Module Federation

**Status:** Zaakceptowany i wdrożony
**Data:** 2026-09-27

## Kontekst

Potrzebujemy ładować mikrofrontendy w czasie działania. Angular CLI buduje
domyślnie **esbuildem** (`@angular/build:application`).

## Rozważane opcje

1. **Module Federation (webpack)** - odrzucone dla tego repozytorium.
   Jest wtyczką webpacka i w praktyce wymusza powrót na wolniejszy builder.
   Ma za to większy ekosystem: MF 2.0, wtyczki runtime, DevTools.
2. **Native Federation** - wybrane. Opiera się na **import maps** i natywnych
   ES modules, więc działa z domyślnym builderem Angulara. Model mentalny jest
   ten sam: `exposes`, `shared`, manifest, `loadRemoteModule`.
3. **Jedna aplikacja z lazy-loadowanymi modułami** - odrzucone, bo nie daje
   niezależnego wdrożenia, czyli jedynego powodu, dla którego robimy MF.

## Decyzja

`@angular-architects/native-federation` w linii **21.x**, zgodnej z Angularem 21.

Pytanie rozstrzygające, które warto powtórzyć na sali: **czy jesteście gotowi
wrócić na webpacka?** Jeśli nie - Native Federation jest drogą mniejszego oporu.

## Konsekwencje

**Zyskujemy:** zostajemy na szybkim builderze; wiedza przenosi się na MF,
bo pojęcia są te same.

**Kupujemy świadomie ten koszt:** węższy ekosystem i mniej gotowych wtyczek.
Dochodzi też `es-module-shims` jako polyfill - bez niego strona jest biała
**bez błędu w konsoli** (patrz `docs/lessons.md`).

**Dla uczestników:** to nie jest rekomendacja uniwersalna. Przy jednym
frameworku i prostym scenariuszu host + kilka remote'ów prostota bije ekosystem.
Przy wielu frameworkach i dużej skali odpowiedź może być inna.
