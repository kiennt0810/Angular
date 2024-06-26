import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'color',
        loadChildren: () => import('./Color/Color.module').then(m => m.ColorManagementModule),
      },
      {
        path: 'storage',
        loadChildren: () => import('./Storage/Storage.module').then(m => m.StorageManagementModule),
      },
      {
        path: 'brand',
        loadChildren: () => import('./Brand/Brand.module').then(m => m.BrandManagementModule),
      },
      {
        path: 'adFile',
        loadChildren: () => import('./AdFile/adFile.module').then(m => m.AdFileManagementModule),
      },

      /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
    ]),
  ],
})
export class QuanlydanhmucRoutingModule { }
