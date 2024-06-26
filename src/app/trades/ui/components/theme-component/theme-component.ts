import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ThemeService } from '@app/trades/util/service';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-component',
  standalone: true,
  imports: [MatSlideToggle, MatIcon, FormsModule],

  template: `
    <div class="theme-container">
      <mat-icon>dark_mode</mat-icon>
      <mat-slide-toggle
        [(ngModel)]="isChecked"
        [hideIcon]="true"
        color="primary"
        (change)="toggleTheme()"
      ></mat-slide-toggle>
      <mat-icon>light_mode</mat-icon>
    </div>
  `,
  styles: `
    .theme-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
})
export class ThemeComponent implements OnInit, OnDestroy {
  themeService = inject(ThemeService);
  isChecked: boolean = false;
  private themeSubscription!: Subscription;

  ngOnInit() {
    this.isChecked = this.themeService.currentTheme === 'dark-theme';
    this.themeSubscription = this.themeService.themeChange$.subscribe(
      (theme) => {
        this.isChecked = theme === 'light-theme';
      },
    );
  }

  ngOnDestroy() {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
