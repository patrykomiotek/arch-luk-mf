---
tytul: 'npm install wywraca się na edgesOut i to nie jest błąd projektu'
obszary: ['narzędzia']
tematy: ['npm', 'peer-dependencies']
---

# `npm install` wywraca się na `edgesOut` i to nie jest błąd projektu

**Kontekst**: zakładanie workspace'u z Angularem 21, Nx 23 i Native Federation.

**Problem**: `npm error Cannot read properties of null (reading 'edgesOut')`,
poprzedzone serią `npm warn ERESOLVE overriding peer dependency`. Komunikat
nie wskazuje żadnego pakietu ani pliku, więc wygląda na uszkodzoną konfigurację
projektu. **Nie jest** - to błąd w arboriście (rozwiązywaczu zależności npm),
który wywraca się przy pewnych kombinacjach konfliktów peer dependencies.

Ten sam błąd wystąpił wcześniej przy `create-nx-workspace`, co skutecznie
zablokowało generator.

**Reguła**: przy tym komunikacie nie szukaj winy w `package.json`. Użyj
`legacy-peer-deps` - w repo jest do tego `.npmrc`, więc zwykłe `npm install`
po prostu działa. Poza repo: `npm install --legacy-peer-deps`.

**Dotyczy**: instalacji zależności w tym repozytorium i każdego workspace'u
z Angularem + Nx w zbliżonej macierzy wersji.
