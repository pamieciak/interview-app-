import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  public currentTheme!: string;
  private themeChangeSubject = new BehaviorSubject<string>(this.currentTheme);

  themeChange$ = this.themeChangeSubject.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializeDefaultTheme();
    this.listenToThemeChanges();
  }

  initializeDefaultTheme(): void {
    this.currentTheme = 'light-theme';
    this.renderer.addClass(document.body, this.currentTheme);
  }

  initializeTheme(): void {
    this.currentTheme = this.prefersDarkScheme.matches
      ? 'dark-theme'
      : 'light-theme';
    this.renderer.removeClass(document.body, 'light-theme');
    this.renderer.addClass(document.body, this.currentTheme);
    this.themeChangeSubject.next(this.currentTheme);
  }

  listenToThemeChanges(): void {
    this.prefersDarkScheme.addEventListener('change', (event) => {
      const theme = event.matches ? 'dark-theme' : 'light-theme';
      this.updateTheme(theme);
    });
  }

  updateTheme(theme: string): void {
    this.renderer.removeClass(document.body, this.currentTheme);
    this.renderer.addClass(document.body, theme);
    this.currentTheme = theme;
    this.themeChangeSubject.next(this.currentTheme);
  }

  toggleTheme(): void {
    if (this.currentTheme === 'light-theme') {
      this.renderer.removeClass(document.body, 'light-theme');
      this.renderer.addClass(document.body, 'dark-theme');
      this.currentTheme = 'dark-theme';
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
      this.renderer.addClass(document.body, 'light-theme');
      this.currentTheme = 'light-theme';
    }
    this.themeChangeSubject.next(this.currentTheme);
  }
}
