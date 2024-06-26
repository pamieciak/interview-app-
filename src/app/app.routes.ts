import { Routes } from '@angular/router';
import { AppComponent } from '@app/app.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./trades/ui/components/table-component/table-component').then(
        (c) => c.TableComponent,
      ),
  },
];
