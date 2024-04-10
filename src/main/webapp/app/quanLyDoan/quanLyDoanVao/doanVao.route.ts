import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';

import { IDelegationIn } from './doanVao.model';
import { CategoriesManagementService } from './service/categories-management.service';
import { CategoriesManagementComponent } from './list/doanVaoList.component';
import { CategoriesManagementDetailComponent } from './detail/categories-management-detail.component';
// import { CategoriesManagementUpdateComponent } from './update/categories-management-update.component';
import { CreateComponent } from './create/create.component';
import { DoanVaoViewComponent } from './view/view.component';
import { DoanVaoEditComponent } from './edit/edit.component';

@Injectable({ providedIn: 'root' })
export class UserManagementResolve implements Resolve<IDelegationIn | null> {
  constructor(private service: CategoriesManagementService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDelegationIn | null> {
    const id = route.params['maDoan'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const userManagementRoute: Routes = [
  {
    path: '',
    component: CategoriesManagementComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'viewDV/:maDoan',
    component: DoanVaoViewComponent,
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
    path: 'edit/:maDoan',
    component:  DoanVaoEditComponent,
    resolve: {
      user: UserManagementResolve,
    },
  },
];
