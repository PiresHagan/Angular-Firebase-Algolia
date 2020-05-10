import { Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';

export const BackofficeLayout_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]

    },
    {
        path: 'app',
        loadChildren: () => import('../../backoffice/backoffice.module').then(m => m.BackofficeModule),
        canActivate: [AuthGuard]

    },
];