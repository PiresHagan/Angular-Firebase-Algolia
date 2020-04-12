import { Routes } from '@angular/router';

export const BackofficeLayout_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'app',
        loadChildren: () => import('../../backoffice/backoffice.module').then(m => m.BackofficeModule)
    },
];