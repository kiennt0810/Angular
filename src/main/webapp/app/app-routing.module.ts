import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';

import { UserRouteAccessService } from './core/auth/user-route-access.service';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        // {
        //   path: 'doanVao',
        //   data: {
        //     authorities: ['03001'],
        //   },
        //   canActivate: [UserRouteAccessService],
        //   loadChildren: () => import('./quanLyDoan/doanVao-routing.module').then(m => m.CategoriesRoutingModule),
        // },
        // {
        //   path: 'quanLyTV',
        //   data: {
        //     authorities: ['03002'],
        //   },
        //   canActivate: [UserRouteAccessService],
        //   loadChildren: () => import('./quanLyDoan/qltv-routing.module').then(m => m.quanLyTVRoutingModule),
        // },
        // {
        //   path: 'doanRa',
        //   data: {
        //     authorities: ['04001'],
        //   },
        //   canActivate: [UserRouteAccessService],
        //   loadChildren: () => import('./quanLyDoan/doanRa-routing.module').then(m => m.DelegationOutRoutingModule),
        // },
        // {
        //   path: 'quanLyTVRa',
        //   data: {
        //     authorities: ['04002'],
        //   },
        //   canActivate: [UserRouteAccessService],
        //   loadChildren: () => import('./quanLyDoan/qltvRa-routing.module').then(m => m.quanLyTVRoutingModule),
        // },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: 'loginFT',
          loadChildren: () => import('./loginFirstTime/loginFT.module').then(m => m.LoginFTModule),
        },
        {
          path: 'register',
          loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
        },
        {
          path: 'personal-account',
          loadChildren: () => import('./entities/personal-account/personal-account.module').then(m => m.PersonalAccountModule),
        },
        {
          path: '',
          loadChildren: () => import(`./entities/entity-routing.module`).then(m => m.EntityRoutingModule),
        },
        {
          path: 'quanlydanhmuc',
          data: {
            authorities: ['02000'],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./quanlydanhmuc/quanlydanhmuc-routing.module').then(m => m.QuanlydanhmucRoutingModule),
        },
        {
          path: 'quantrihethong',
          data: {
            authorities: ['01000'],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./quanTriHeThong/quanTriHeThong-routing.module').then(m => m.QuanTriHeThongRoutingModule),
        },
        {
          data: {
            authorities: ['05000'],
          },
          canActivate: [UserRouteAccessService],
          path: 'customer',
          loadChildren: () => import('./customer/customer-routing.module').then(m => m.CustomerRoutingModule),
        },
        {
          data: {
            authorities: ['03000'],
          },
          canActivate: [UserRouteAccessService],
          path: 'product',
          loadChildren: () => import('./product/product-routing.module').then(m => m.ProductRoutingModule),
        },
        {
          data: {
            authorities: ['07001'],
          },
          canActivate: [UserRouteAccessService],
          path: 'HoChieu',
          loadChildren: () => import('./quanLyHoChieu/HCNG-routing.module').then(m => m.HChieuNGRoutingModule),
        },
        {
          data: {
            authorities: ['07002'],
          },
          canActivate: [UserRouteAccessService],
          path: 'HoChieu',
          loadChildren: () => import('./quanLyHoChieu/GNHC-routing.module').then(m => m.GNHCRoutingModule),
        },
        {
          data: {
            authorities: ['07003'],
          },
          canActivate: [UserRouteAccessService],
          path: 'HoChieu',
          loadChildren: () => import('./quanLyHoChieu/KTHC-routing.module').then(m => m.KTHCRoutingModule),
        },
        navbarRoute,
        ...errorRoute,
      ],
      // { enableTracing: DEBUG_INFO_ENABLED }
      { enableTracing: false, onSameUrlNavigation: 'reload', }
    ),
  ],
  exports: [RouterModule],
})

export class AppRoutingModule {}
