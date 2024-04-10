import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
/* jhipster-needle-add-admin-module-import - JHipster will add admin modules imports here */

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
        {
            path: 'quanlynguoisudung',
            loadChildren: () => import('./quanlyNguoiSuDung/quanlyNguoiSuDung.module').then(m => m.QuanLyNguoiSuDungModule),
            data: {
             authorities: ['01001'],
            },
          canActivate: [UserRouteAccessService],
        },
        {
          path: 'HTNhom',
          loadChildren: () => import('./HTNhom/HTNhom.module').then(m => m.HTNhomModule),
      },
      {
        path: 'HTNhomNhanVien',
        loadChildren: () => import('./HTNhomNhanVien/HTNhomNhanVien.module').then(m => m.HTNhomNhanVienModule),
      },
{
        path: 'HTQuyen',
        loadChildren: () => import('./HTQuyen/HTQuyen.module').then(m => m.HTQuyenModule),
      },
      {
        path: 'ChangePassword',
        loadChildren: () => import('./ChangePassword/ChangePassword.module').then(m => m.ChangePasswordModule),
      },
      
      /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
    ]),
  ],
})
export class QuanTriHeThongRoutingModule {}
