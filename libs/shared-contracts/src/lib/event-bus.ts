import { InjectionToken } from '@angular/core';

import type { DomainEvent } from './events';

/**
 * Szyna zdarzeń oparta na `EventTarget` - standardzie przeglądarki.
 *
 * Dlaczego `EventTarget`, a nie `Subject` z RxJS: zero zależności, więc szyna
 * działa między mikrofrontendami niezależnie od tego, czy drugi z nich ma
 * w ogóle RxJS i w jakiej wersji.
 */
export class EventBus {
  readonly #target = new EventTarget();

  publish<E extends DomainEvent>(event: E): void {
    this.#target.dispatchEvent(
      new CustomEvent(event.type, { detail: event }),
    );
  }

  /**
   * Zwraca funkcję odpinającą. To NIE jest ozdobnik: mikrofrontendy są
   * ładowane i odładowywane w trakcie nawigacji, a nieodpięty nasłuch
   * to wyciek pamięci, który ujawnia się dopiero po godzinie pracy.
   */
  on<E extends DomainEvent>(
    type: E['type'],
    handler: (event: E) => void,
  ): () => void {
    const listener = (e: Event) => handler((e as CustomEvent<E>).detail);
    this.#target.addEventListener(type, listener);
    return () => this.#target.removeEventListener(type, listener);
  }
}

/**
 * Wstrzykujemy przez token, nie przez klasę - dzięki temu test podmienia
 * szynę jedną linią w `providers`, a mikrofrontend nie zna implementacji.
 */
export const EVENT_BUS = new InjectionToken<EventBus>('EVENT_BUS', {
  providedIn: 'root',
  factory: () => new EventBus(),
});
