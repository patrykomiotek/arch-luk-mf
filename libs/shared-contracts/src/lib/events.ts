/**
 * Kontrakt zdarzeń między mikrofrontendami.
 *
 * Każde zdarzenie niesie `version`. To tanie zabezpieczenie: gdy kształt
 * zdarzenia się zmieni, odbiorca może przez jeden cykl wydawniczy obsłużyć
 * obie wersje. Bez tego każda zmiana kontraktu wymaga jednoczesnego wdrożenia
 * obu stron - czyli dokładnie tego, czego mikrofrontendy miały uniknąć.
 *
 * Kwoty ZAWSZE w groszach jako liczby całkowite (patrz ADR-004).
 */

export type ProductAddedToCart = {
  type: 'product-added-to-cart';
  version: 1;
  payload: {
    productId: string;
    quantity: number;
    unitPriceInCents: number;
  };
};

export type UserLoggedIn = {
  type: 'user-logged-in';
  version: 1;
  payload: { username: string };
};

/** Suma wszystkich zdarzeń. Literówka w nazwie = błąd kompilacji. */
export type DomainEvent = ProductAddedToCart | UserLoggedIn;
