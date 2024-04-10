import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'KiemTraHC',
        loadChildren: () => import('./kiemTraHC/kiemTraHC.module').then(m => m.KTHCManagementModule),
        data: {
          pageTitle: 'Kiểm tra hộ chiếu',
        },
      },
    ]),
  ],
})
export class KTHCRoutingModule {}
