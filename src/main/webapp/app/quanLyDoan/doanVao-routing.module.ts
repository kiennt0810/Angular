import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'quanLyDoanVao',
        loadChildren: () => import('./quanLyDoanVao/doanVao.module').then(m => m.CategoriesManagementModule),
        data: {
          pageTitle: 'userManagement.home.title',
        },
      },
      {
        path: 'quanLyTV',
         loadChildren: () => import('./quanLyTV/quanLyTV.module').then(m => m.QuanLyTVModule),
      },
      /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
    ]),
  ],
})
export class CategoriesRoutingModule {}
