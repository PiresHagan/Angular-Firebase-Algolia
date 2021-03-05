import { Routes } from '@angular/router';

export const FullLayout_ROUTES: Routes = [
    {
        path: '',
        loadChildren: () => import('../../authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
        path: 'onboarding',
        loadChildren: () => import('../../onboarding/onboarding.module').then(m => m.OnboardingModule)
    }
];