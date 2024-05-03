import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';

import { UserRouteAccessService } from './core/auth/user-route-access.service';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
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
