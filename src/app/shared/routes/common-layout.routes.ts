import { Routes } from '@angular/router';

export const CommonLayout_ROUTES: Routes = [
    {
        path: '',
        loadChildren: () => import('../../public/public.module').then(m => m.PublicModule)
    }
];