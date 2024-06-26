import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from '@app/trades/util/service';
import { TableComponent } from '@app/trades/ui/components';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TableComponent, MatButton],
  styleUrl: './app.component.scss',
  template: `
    <h1>Interview table</h1>
    <button mat-raised-button color="primary" (click)="goToTrades()">
      Pokaż zlecenia
    </button>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  rouer = inject(Router);

  goToTrades() {
    this.rouer.navigate(['orders']);
  }
}
