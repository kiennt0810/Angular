import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'quanLyDoanRa',
        loadChildren: () => import('./quanLyDoanRa/doanRa.module').then(m => m.DelegationOutManagementModule),
        data: {
          pageTitle: 'delegationOut.home.title',
        },
      },
      {
        path: 'quanLyTVRa',
        loadChildren: () => import('./quanLyTVRa/quanLyTVRa.module').then(m => m.QuanLyTVModule),
        data: {
          pageTitle: 'userManagement.home.title',
        },
      },
      /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
    ]),
  ],
})
export class DelegationOutRoutingModule {}
