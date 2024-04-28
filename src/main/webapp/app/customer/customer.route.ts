import { Injectable, createComponent } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Customer } from './customer.model';
import { CustomerService } from './customer.service';
import { CustomerManagementComponent } from './list/list.component';



@Injectable({ providedIn: 'root' })
export class CustomerResolve implements Resolve<Customer | null> {
  constructor(private service: CustomerService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Customer | null> {
    const id = route.params['login'];
    if (id) {
      return this.service.find(id);
    }
    return of(null);
  }
}

export const CustomerManagementRoute: Routes = [
  {
    path: '',
    component: CustomerManagementComponent,
    data: {
      defaultSort: 'id,asc',
    },
  },
//   {
//     path: 'new',
//     component: newProductComponent,
//     data: {
//       defaultSort: 'id,asc',
//     },
//   },
//   {
//     path: 'view/:id',
//     component: ViewComponent,
//     resolve: {
//       user: UserManagementResolve,
//     },
//   },
//    {
//     path: 'editProduct/:ProductId',
//     component: ProductUpdateComponent,
//     resolve: {
//       user: ProductResolve,
//     },
//   },
];

