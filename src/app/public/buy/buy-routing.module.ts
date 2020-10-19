

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyComponent } from './buy.component';

const routes: Routes = [
    {
        path: '',
        component: BuyComponent,
        data: {
            title: 'faq version 2',
            headerDisplay: 'none'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BuyRoutingModule { }
    