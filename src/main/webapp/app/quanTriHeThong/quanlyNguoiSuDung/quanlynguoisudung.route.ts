import { ActivatedRouteSnapshot, Resolve, Routes } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { QuanLyNguoiSuDungComponent } from "./list/quanlynguoisudung.component";
import { QuanLyNguoiSuDungService } from "./quanlynguoisudung.service";
import { IUser } from "./quanlynguoisudung.model";
import { QuanLyNguoiSuDungCreateComponent } from "./create/quanlynguoisudung-create.component";
import { QuanLyNguoiSuDungEditComponent } from "./edit/quanlynguoisudung-edit.component";

@Injectable({ providedIn: 'root' })
export class QuanLyNguoiSuDungResolve implements Resolve<IUser | null> {
    constructor(private service: QuanLyNguoiSuDungService) {}
  
    resolve(route: ActivatedRouteSnapshot): Observable<IUser | null> {
      const id = route.params['id'];
      if (id) {
        return this.service.find(id);
      }
      return of(null);
    }
}
  
export const quanlynguoisudungRoute: Routes = [
    {
        path: '',
        component: QuanLyNguoiSuDungComponent,
        data: {
            defaultSort: 'id,asc'
        }
    },
    {
        path: 'create',
        component: QuanLyNguoiSuDungCreateComponent,
        resolve: {
            user: QuanLyNguoiSuDungResolve
        }
    },
    {
        path: 'edit/:id',
        component: QuanLyNguoiSuDungEditComponent,
        resolve: {
            user: QuanLyNguoiSuDungResolve
        }
    }
]   