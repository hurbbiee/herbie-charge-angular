import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'charge',
    loadComponent: () => import('./pages/charge/charge.component').then((m) => m.ChargeComponent),
  },
  {
    path: '',
    redirectTo: 'charge',
    pathMatch: 'full',
  },
];
