import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main style="padding: 1.5rem">
      <p style="color:#6b778c">
        flights uruchomiony samodzielnie (port 4201)
      </p>
      <router-outlet />
    </main>
  `,
})
export class App {}
