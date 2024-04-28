import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () => import('./customer.module').then(m => m.CustomerModule),
      },
   
    ]),
  ],
})
export class CustomerRoutingModule { }
