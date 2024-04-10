import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { IPassport } from './loaihochieu.model';
import { PassportService } from './loaihochieu.service';
import { newPassportComponent } from './create/loaihochieu-create.component';
import { PassportManagementComponent } from './list/loaihochieu.component';
import { PassportUpdateComponent } from './edit/loaihochieu-update.component';



@Injectable({ providedIn: 'root' })
export class PassportResolve implements Resolve<IPassport | null> {
  constructor(private service: PassportService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPassport | null> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const PassportManagementRoute: Routes = [
  {
    path: '',
    component: PassportManagementComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'view',
    component: PassportManagementComponent,
    resolve: {
        passport: PassportResolve,
    },
  },
  {
    path: 'newPassport',
    component: newPassportComponent,
    resolve: {
        passport: PassportResolve,
    },
  },
  {
    path: 'editPassport/:passportId',
    component: PassportUpdateComponent,
    resolve: {
        passport: PassportResolve,
    },
  },
];
