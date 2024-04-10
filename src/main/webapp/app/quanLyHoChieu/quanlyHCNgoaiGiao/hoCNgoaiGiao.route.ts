import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';

import { HoChieuNgoaiGiao } from './hoCNgoaiGiao.model';
import { HChieuNGService } from './service/hoCNgoaiGiao.service';
import { HChieuNGComponent } from './quanLyHCNgoaiGiao-list/hoCNgoaiGiao.component';
import { newHCNgoaiGiaoComponent } from './quanLyHCNgoaiGiao-new/hoCNgoaiGiao-new.component';
import { HCNgoaiGiaoUpdateComponent } from './quanLyHCNgoaiGiao-update/hoCNgoaiGiao-update.component';
import { HCNgoaiGiaoViewComponent } from './quanLyHCNgoaiGiao-view/HCNG-view.component';

@Injectable({ providedIn: 'root' })
export class HChieuNGResolve implements Resolve<HoChieuNgoaiGiao | null> {
  constructor(private service: HChieuNGService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<HoChieuNgoaiGiao | null> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const HChieuNGManagementRoute: Routes = [
  {
    path: '',
    component: HChieuNGComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'view/:soHC',
    component: HCNgoaiGiaoViewComponent,
    resolve: {
        passport: HChieuNGResolve,
    },
  },
  {
    path: 'newHChieuNG',
    component: newHCNgoaiGiaoComponent,
    resolve: {
        passport: HChieuNGResolve,
    },
  },
  {
    path: 'editPassport/:soHC',
    component: HCNgoaiGiaoUpdateComponent,
    resolve: {
        passport: HChieuNGResolve,
    },
  },
];
