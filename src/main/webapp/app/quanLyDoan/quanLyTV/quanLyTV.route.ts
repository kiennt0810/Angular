import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';

import { IQuanLyTV } from './quanLyTV.model';
import { QuanLyTVService } from './service/quanLyTV.service';
import { quanLyTVComponent } from './list/quanLyTV.component';
// import { CategoriesManagementDetailComponent } from './detail/categories-management-detail.component';
// import { CategoriesManagementUpdateComponent } from './update/categories-management-update.component';
import { CreateComponent } from './create/create.component';
import { QuanLyTvViewComponent } from './view/view.component';
import { TvEditComponent } from './edit/edit.component';

@Injectable({ providedIn: 'root' })
export class UserManagementResolve implements Resolve<IQuanLyTV | null> {
  maDoan: string;
  constructor(private service: QuanLyTVService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IQuanLyTV | null> {
    // const id = route.params['login'];
    // if (id) {
    //   return this.service.find(id);
    // }
    // return of(null);
    this.service.getCurrentMaDoan.subscribe(item => {
      this.maDoan = item;
      console.log(this.maDoan);
    })
    return of(null)
  }


}


export const quanLyTVRoute: Routes = [
  {
    path: '',
    component: quanLyTVComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'viewTV/:maTV',
    component: QuanLyTvViewComponent,
    resolve: {
      user: UserManagementResolve,
    },
  },
  {
    path:   'new/:maDoan',
    component: CreateComponent,
    resolve: {
      user: UserManagementResolve,
    },
  },
  {
    path: 'edit/:maTV',
    component:  TvEditComponent,
    resolve: {
      user: UserManagementResolve,
    },
  },
];
