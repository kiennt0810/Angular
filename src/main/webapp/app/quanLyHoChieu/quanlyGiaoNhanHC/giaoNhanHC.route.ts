import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';

import { GiaoNhanHC } from './giaoNhanHC.model';
import { GiaoNhanHCService } from './service/giaoNhanHC.service';
import { GiaoNhanHCComponent } from './giaoNhanHC-list/giaoNhanHC.component';
import { newGNHCComponent } from './giaoNhanHC-new/giaoNhanHC-new.component';
import { updateGNHCComponent } from './giaoNhanHC-update/giaoNhanHC-update.component';

@Injectable({ providedIn: 'root' })
export class GiaoNhanHCResolve implements Resolve<GiaoNhanHC | null> {
  constructor(private service: GiaoNhanHCService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<GiaoNhanHC | null> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const GiaoNhanHCManagementRoute: Routes = [
  {
    path: '',
    component: GiaoNhanHCComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'view',
    component: GiaoNhanHCComponent,
    resolve: {
        passport: GiaoNhanHCResolve,
    },
  },
  {
    path: 'newGNHChieu',
    component: newGNHCComponent,
    resolve: {
        passport: GiaoNhanHCResolve,
    },
  },
  {
    path: 'editGNHChieu/:gNHCId',
    component: updateGNHCComponent,
    resolve: {
        passport: GiaoNhanHCResolve,
    },
  },
];
