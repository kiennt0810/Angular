import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AdFile } from './adFile.model';
import { AdFileService } from './adFile.service';
import { AdFileManagementComponent } from './list/list.component';
import { newAdFileComponent } from './create/create.component';




@Injectable({ providedIn: 'root' })
export class AdFileResolve implements Resolve<AdFile | null> {
  constructor(private service: AdFileService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<AdFile | null> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const AdFileManagementRoute: Routes = [
  {
    path: '',
    component: AdFileManagementComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
//   {
//     path: 'view',
//     component: BrandManagementComponent,
//     resolve: {
//         ChucVu: BrandResolve,
//     },
//   },
   {
    path: 'newAdFile',
    component: newAdFileComponent,
    resolve: {
        ChucVu: AdFileResolve,
    },
  },
//   {
//     path: 'editBrand/:brandId',
//     component: BrandUpdateComponent,
//     resolve: {
//         passport: BrandResolve,
//     },
//   },
];
