import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Storage } from './Storage.model';
import { StorageService } from './Storage.service';

import { StorageManagementComponent } from './Storage-list/list.component';
import { newStorageComponent } from './Storage-create/create.component';
import { StorageUpdateComponent } from './Storage-update/update.component';
// import { newColorComponent } from './Color-create/Create.component';
// import { ColorUpdateComponent } from './Color-update/Update.component';




@Injectable({ providedIn: 'root' })
export class StorageResolve implements Resolve<Storage | null> {
  constructor(private service: StorageService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Storage | null> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const StorageManagementRoute: Routes = [
  {
    path: '',
    component: StorageManagementComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'view',
    component: StorageManagementComponent,
    resolve: {
        ChucVu: StorageResolve,
    },
  },
  {
    path: 'newStorage',
    component: newStorageComponent,
    resolve: {
        ChucVu: StorageResolve,
    },
  },
  {
    path: 'editStorage/:storageId',
    component: StorageUpdateComponent,
    resolve: {
        passport: StorageResolve,
    },
  },
];
