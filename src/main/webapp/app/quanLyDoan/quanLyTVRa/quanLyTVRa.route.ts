import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';

import { IQuanLyTV } from './quanLyTVRa.model';
import { QuanLyTVService } from './service/quanLyTVRa.service';
import { quanLyTVRaComponent } from './list/quanLyTVRa.component';
import { CreateComponent } from './create/create.component';
import { QuanLyTvRaViewComponent } from './view/view.component';
import { TvEditComponent } from './edit/edit.component';


@Injectable({ providedIn: 'root' })
export class UserManagementResolve implements Resolve<IQuanLyTV | null> {
  constructor(private service: QuanLyTVService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IQuanLyTV | null> {
    const id = route.params['login'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const quanLyTVRoute: Routes = [
  {
    path: '',
    component: quanLyTVRaComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'viewTV/:maTV',
    component: QuanLyTvRaViewComponent,
    resolve: {
      user: UserManagementResolve,
    },
  },
  {
    path: 'new',
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
