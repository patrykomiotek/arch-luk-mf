---
title: 'shareAll() bierze wszystko z package.json i z tsconfig paths, także to, czego nie używasz'
areas: ['federacja']
topics: ['native-federation', 'shared', 'build']
---

# `shareAll()` bierze wszystko z package.json i z tsconfig paths, także to, czego nie używasz

**Kontekst**: pierwszy build federacji dla `flights`.

**Problem**: build padał dwukrotnie, za każdym razem na czymś, czego
aplikacja nigdzie nie importuje.

1. `Could not resolve ".../libs/shared-ui/src/index.ts"` - bo
   `tsconfig.base.json` miał mapowanie `@mf/ui`, a biblioteki jeszcze
   nie było. `shareAll` czyta **mapowania ścieżek**, nie użycia.

2. `Could not resolve "@angular/animations/browser"` - bo współdzielony
   `@angular/platform-browser` odwołuje się do animacji wewnętrznie,
   w `animations-async.mjs`. **Dopisanie animacji do `skip` nie pomogło** -
   odwołanie siedzi w środku innego pakietu, który i tak jest współdzielony.
   Pomogło dopiero zainstalowanie `@angular/animations`.

**Reguła**: przy błędzie „Could not resolve" w fazie *Preparing shared npm
packages* nie szukaj tego pakietu w swoim kodzie. Sprawdź kolejno:

- czy `tsconfig` ma mapowanie do czegoś, czego nie ma na dysku,
- czy pakiet jest wciągany **przez inny współdzielony pakiet** - wtedy trzeba
  go doinstalować, a nie pominąć.

**Dotyczy**: `apps/*/federation.config.js`, każdej zmiany w `tsconfig.base.json`
`paths` i każdego dodania biblioteki do workspace'u.
