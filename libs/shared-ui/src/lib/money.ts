import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Komponent prezentacyjny: NIE wstrzykuje serwisów, dostaje wszystko wejściem.
 * Dlatego da się go użyć w każdym mikrofrontendzie bez przenoszenia
 * połowy aplikacji.
 *
 * Uwaga na granicę: ta biblioteka ma tag `type:ui` i wolno jej zależeć
 * tylko od `type:ui` i `type:util` - nigdy od domeny żadnej aplikacji.
 */
@Component({
  selector: 'ui-money',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ formatted() }}`,
})
export class Money {
  /** Kwota w groszach. Nazwa niesie jednostkę - to nie jest ozdobnik. */
  readonly amountInCents = input.required<number>();

  readonly formatted = computed(
    () => (this.amountInCents() / 100).toFixed(2).replace('.', ',') + ' zł',
  );
}
