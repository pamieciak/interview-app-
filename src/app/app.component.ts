import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TableComponent } from '../ui/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TableComponent],
  styleUrl: './app.component.scss',
  template: ` <app-table-component /> `,
})
export class AppComponent {
  title = 'interview-table-app';
}
