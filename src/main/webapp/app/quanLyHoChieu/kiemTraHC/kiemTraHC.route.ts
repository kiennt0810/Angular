import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

import { KiemTraHC } from './kiemTraHC.model';
import { KiemTraHCService } from './service/kiemTraHC.service';
import { KiemTraHCComponent } from './kiemTraHC-list/kiemTraHC.component';
//import { newGNHCComponent } from './giaoNhanHC-new/giaoNhanHC-new.component';
//import { HCNgoaiGiaoUpdateComponent } from './quanLyHCNgoaiGiao-update/hoCNgoaiGiao-update.component';

@Injectable({ providedIn: 'root' })
export class KiemTraHCResolve implements Resolve<KiemTraHC | null> {
  constructor(private service: KiemTraHCService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): KiemTraHC | Observable<KiemTraHC> | Promise<KiemTraHC> {
    throw new Error('Method not implemented.');
  }

}

export const KiemTraHCManagementRoute: Routes = [
  {
    path: '',
    component: KiemTraHCComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'view',
    component: KiemTraHCComponent,
    resolve: {
        passport: KiemTraHCResolve,
    },
  },
];
