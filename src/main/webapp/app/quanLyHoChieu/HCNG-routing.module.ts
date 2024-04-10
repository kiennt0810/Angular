import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'quanlyHCNgoaiGiao',
        loadChildren: () => import('./quanlyHCNgoaiGiao/hoCNgoaiGiao.module').then(m => m.HChieuNGManagementModule),
        data: {
          pageTitle: 'Quản lý hộ chiếu ngoại giao',
        },
      },
    //   {
    //     path: 'docs',
    //     loadChildren: () => import('./docs/docs.module').then(m => m.DocsModule),
    //   },
    //   {
    //     path: 'gateway',
    //     loadChildren: () => import('./gateway/gateway.module').then(m => m.GatewayModule),
    //   },
      /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
    ]),
  ],
})
export class HChieuNGRoutingModule {}
