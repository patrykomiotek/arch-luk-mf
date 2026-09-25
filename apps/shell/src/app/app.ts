import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CartBadge } from './cart-badge';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CartBadge],
  template: `
    <header
      style="display:flex;gap:1.5rem;align-items:center;padding:1rem 1.5rem;
             border-bottom:2px solid var(--orange)"
    >
      <strong style="font-size:1.1rem">Łukasiewicz · podróże</strong>
      <nav style="display:flex;gap:1rem;flex:1">
        <a routerLink="/">Start</a>
        <a routerLink="/flights">Loty</a>
      </nav>
      <app-cart-badge />
    </header>

    <main style="padding: 1.5rem">
      <router-outlet />
    </main>
  `,
})
export class App {}
