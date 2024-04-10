import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ChucVu } from './ChucVu.model';
import { ChucVuService } from './ChucVu.service';
import { newChucVuComponent } from './create/ChucVu-create.component';
import { ChucVuManagementComponent } from './list/ChucVu.component';
import { ChucVuUpdateComponent } from './edit/ChucVu-edit.component';



@Injectable({ providedIn: 'root' })
export class ChucVuResolve implements Resolve<ChucVu | null> {
  constructor(private service: ChucVuService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ChucVu | null> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const ChucVuManagementRoute: Routes = [
  {
    path: '',
    component: ChucVuManagementComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'view',
    component: ChucVuManagementComponent,
    resolve: {
        ChucVu: ChucVuResolve,
    },
  },
  {
    path: 'newChucVu',
    component: newChucVuComponent,
    resolve: {
        ChucVu: ChucVuResolve,
    },
  },
  {
    path: 'editChucVu/:chucVuId',
    component: ChucVuUpdateComponent,
    resolve: {
        passport: ChucVuResolve,
    },
  },
];
