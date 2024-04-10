import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UpdateComponent } from './update/update.component';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { ITKQTThongTinVM } from './TKQTThongTinVM.model';
import { TiepkhachquocteService } from './service/tiepkhachquoctet.service';
import { ViewComponent } from './view/view.component';


@Injectable({ providedIn: 'root' })
export class UserManagementResolve implements Resolve<ITKQTThongTinVM | null> {
  constructor(private service: TiepkhachquocteService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITKQTThongTinVM | null> {
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
