import { Injectable, createComponent } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UpdateComponent } from './update/update.component';
import { CreateComponent } from './create/create.component';
import { DeleteComponent } from './delete/delete.component';
import { ListComponent } from './list/list.component';
import { IHDNgoaiGiaoVM } from './HDNgoaiGiaoVM.model';
import { NgoaiGiaoDoanService } from './service/ngoai-giao-doan.service';
import { ViewComponent } from './view/view.component';


@Injectable({ providedIn: 'root' })
export class UserManagementResolve implements Resolve<IHDNgoaiGiaoVM | null> {
  constructor(private service: NgoaiGiaoDoanService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHDNgoaiGiaoVM | null> {
    const id = route.params['login'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const userManagementRoute: Routes = [
  {
    path: '',
    component: ListComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'new',
    component: CreateComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'view/:id',
    component: ViewComponent,
    resolve: {
      user: UserManagementResolve,
    },
  },
  {
    path: 'edit/:id',
    component: UpdateComponent,
    resolve: {
      user: UserManagementResolve,
    },
  },
];

