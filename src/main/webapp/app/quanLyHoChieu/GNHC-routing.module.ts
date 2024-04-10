import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'GiaoNhanHC',
        loadChildren: () => import('./quanlyGiaoNhanHC/giaoNhanHC.module').then(m => m.GNHCManagementModule),
        data: {
          pageTitle: 'Quản lý giao nhận hộ chiếu',
        },
      },
    ]),
  ],
})
export class GNHCRoutingModule {}
