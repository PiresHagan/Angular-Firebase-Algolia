import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'contact',
    loadChildren: () => import('../public/contact/contact.module').then(m => m.ContactModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('../public/terms/terms.module').then(m => m.TermsModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('../public/privacy/privacy.module').then(m => m.PrivacyModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('../public/faq/faq.module').then(m => m.FaqModule)
  },
  {
    path: 'about',
    loadChildren: () => import('../public/about/about.module').then(m => m.AboutModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileRoutingModule { }
