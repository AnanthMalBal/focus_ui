import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'lms',
    loadChildren: () =>
      import('../modules/lms/lms.module').then((m) => m.LmsModule),
    
  },
  { path: '**', redirectTo: 'lms' },
  
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
