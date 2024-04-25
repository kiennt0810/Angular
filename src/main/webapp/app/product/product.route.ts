import { Injectable, createComponent } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ProductManagementComponent } from './list/list.component';
import { newProductComponent } from './new/new.component';
import { ProductUpdateComponent } from './update/update.component';


@Injectable({ providedIn: 'root' })
export class ProductResolve implements Resolve<Product | null> {
  constructor(private service: ProductService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Product | null> {
    const id = route.params['login'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const ProductManagementRoute: Routes = [
  {
    path: '',
    component: ProductManagementComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
  {
    path: 'new',
    component: newProductComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
//   {
//     path: 'view/:id',
//     component: ViewComponent,
//     resolve: {
//       user: UserManagementResolve,
//     },
//   },
   {
    path: 'editProduct/:ProductId',
    component: ProductUpdateComponent,
    resolve: {
      user: ProductResolve,
    },
  },
];

