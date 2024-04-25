import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Color } from './Color.model';
import { ColorService } from './Color.service';

import { ColorManagementComponent } from './Color-list/Color-list.component';
import { newColorComponent } from './Color-create/Create.component';
import { ColorUpdateComponent } from './Color-update/Update.component';




@Injectable({ providedIn: 'root' })
export class ColorResolve implements Resolve<Color | null> {
  constructor(private service: ColorService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Color | null> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const ColorManagementRoute: Routes = [
  {
    path: '',
    component: ColorManagementComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'view',
    component: ColorManagementComponent,
    resolve: {
        ChucVu: ColorResolve,
    },
  },
  {
    path: 'newColor',
    component: newColorComponent,
    resolve: {
        ChucVu: ColorResolve,
    },
  },
  {
    path: 'editColor/:colorId',
    component: ColorUpdateComponent,
    resolve: {
        passport: ColorResolve,
    },
  },
];
