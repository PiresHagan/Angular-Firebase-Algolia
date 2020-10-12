import { Routes } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';

export const BackofficeLayout_ROUTES: Routes = [

    {
        path: '',
        loadChildren: () => import('../../backoffice/backoffice.module').then(m => m.BackofficeModule),
        canActivate: [AuthGuard]
    },
];