import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TableComponent } from '../ui/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TableComponent],
  styleUrl: './app.component.scss',
  template: `
    <div>
      <button (click)="toggleTheme()">Toggle Theme</button>
    </div>
    <app-table-component />
  `,
})
export class AppComponent implements OnInit {
  currentTheme!: 'light-theme' | 'dark-theme';

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.applySystemTheme();

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', this.applySystemTheme.bind(this));
  }

  applySystemTheme() {
    const prefersDarkScheme = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    if (prefersDarkScheme) {
      this.renderer.removeClass(document.body, 'light-theme');
      this.renderer.addClass(document.body, 'dark-theme');
      this.currentTheme = 'dark-theme';
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
      this.renderer.addClass(document.body, 'light-theme');
      this.currentTheme = 'light-theme';
    }
  }

  toggleTheme() {
    if (this.currentTheme === 'light-theme') {
      this.renderer.removeClass(document.body, 'light-theme');
      this.renderer.addClass(document.body, 'dark-theme');
      this.currentTheme = 'dark-theme';
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
      this.renderer.addClass(document.body, 'light-theme');
      this.currentTheme = 'light-theme';
    }
  }
}
