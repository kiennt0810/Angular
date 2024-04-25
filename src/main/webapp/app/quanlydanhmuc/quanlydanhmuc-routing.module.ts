import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'quocgiavavunglanhtho',
        loadChildren: () => import('./quocgiavavunglanhtho/quocgiavavunglanhtho.module').then(m => m.QuocgiavavunglanhthoModule),
      },
      {
        path: 'loaihochieu',
        loadChildren: () => import('./loaihochieu/loaihochieu.module').then(m => m.PassportManagementModule),
      },
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

      /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
    ]),
  ],
})
export class QuanlydanhmucRoutingModule { }
