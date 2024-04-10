import { ActivatedRouteSnapshot, Resolve, Routes } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HTNhomComponent } from "./list/HTNhom.component";
import { HTNhomService } from "./HTNhom.service";
import { IUser } from "./HTNhom.model";
import { HTNhomCreateComponent } from "./create/HTNhom-create.component";
import { HTNhomEditComponent } from "./edit/HTNhom-edit.component";

@Injectable({ providedIn: 'root' })
export class HTNhomResolve implements Resolve<IUser | null> {
    constructor(private service: HTNhomService) {}
  
    resolve(route: ActivatedRouteSnapshot): Observable<IUser | null> {
      const id = route.params['id'];
      if (id) {
        return this.service.find(id);
      }
      return of(null);
    }
}
  
export const HTNhomRoute: Routes = [
    {
        path: '',
        component: HTNhomComponent,
        data: {
            defaultSort: 'id,asc'
        }
    },
    {
        path: 'create',
        component: HTNhomCreateComponent,
        resolve: {
            user: HTNhomResolve
        }
    },
    {
        path: 'edit/:id',
        component: HTNhomEditComponent,
        resolve: {
            user: HTNhomResolve
        }
    }
]