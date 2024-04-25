import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Brand } from './Brand.model';
import { BrandService } from './Brand.service';
import { BrandManagementComponent } from './Brand-list/list.component';
import { newBrandComponent } from './Brand-create/create.component';
import { BrandUpdateComponent } from './Brand-update/update.component';




@Injectable({ providedIn: 'root' })
export class BrandResolve implements Resolve<Brand | null> {
  constructor(private service: BrandService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Brand | null> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const BrandManagementRoute: Routes = [
  {
    path: '',
    component: BrandManagementComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'view',
    component: BrandManagementComponent,
    resolve: {
        ChucVu: BrandResolve,
    },
  },
  {
    path: 'newBrand',
    component: newBrandComponent,
    resolve: {
        ChucVu: BrandResolve,
    },
  },
  {
    path: 'editBrand/:brandId',
    component: BrandUpdateComponent,
    resolve: {
        passport: BrandResolve,
    },
  },
];
