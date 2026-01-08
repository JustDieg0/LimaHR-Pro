import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () => import('./shared/layout/main-layout/main-layout')
      .then(m => m.MainLayout),
    children: [
      {
        path: '',
        redirectTo: 'departamentos',
        pathMatch: 'full'
      },
      {
        path: 'departamentos',
        loadComponent: () => import('./pages/departamentos/list/list')
          .then(m => m.List)
      },
      {
        path: 'empleados',
        loadComponent: () => import('./pages/departamentos/list/list')
          .then(m => m.List)
      }
    ]
  }
];
