import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';

import { IDoanRa } from './doanRa.model';
import { DoanRaService } from './service/delegation-out.service';
import { DoanRaComponent } from './list/doanRaList.component';
import { DoanRaCreateComponent } from './new/create.component';
import { DoanRaEditComponent } from './edit/edit.component';
import { DoanRaViewComponent } from './view/view.component';

@Injectable({ providedIn: 'root' })
export class DelegationOutResolve implements Resolve<IDoanRa | null> {
  constructor(private service: DoanRaService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDoanRa | null> {
    const id = route.params['login'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const delegationOutManagementRoute: Routes = [
  {
    path: '',
    component: DoanRaComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: ':login/view',
    component: DoanRaComponent,
    resolve: {
        delegationOut: DelegationOutResolve,
    },
  },
  {
    path: 'new',
    component: DoanRaCreateComponent,
    resolve: {
      delegationOut: DelegationOutResolve,
    },
  },
  {
    path: 'editDR/:maDoan',
    component:  DoanRaEditComponent,
    resolve: {
      user: DelegationOutResolve,
    },
  },
  {
    path: 'viewDR/:maDoan',
    component: DoanRaViewComponent,
    resolve: {
      user: DelegationOutResolve,
    },
  },
];
