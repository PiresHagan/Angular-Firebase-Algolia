import { Routes } from '@angular/router';

export const CommonLayout_ROUTES: Routes = [
    {
        path: '',
        loadChildren: () => import('../../public/public.module').then(m => m.PublicModule)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule)
    } 
];