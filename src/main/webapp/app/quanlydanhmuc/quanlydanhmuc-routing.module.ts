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
        path: 'chucVu',
        loadChildren: () => import('./ChucVu/ChucVu.module').then(m => m.ChucVuManagementModule),
      },


      /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
    ]),
  ],
})
export class QuanlydanhmucRoutingModule { }
