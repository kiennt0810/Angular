import { ActivatedRouteSnapshot, Resolve, Routes } from "@angular/router";
import { QuocgiavavunglanhthoComponent } from "./list/quocgiavavunglanhtho.component";
import { Injectable } from "@angular/core";
import { QuocgiavavunglanhthoService } from "./quocgiavavunglanhtho.service";
import { Observable, of } from "rxjs";
import { IUser } from "./quocgiavavunglanhtho.model";
import { QuocgiavavunglanhthoCreateComponent } from "./create/quocgiavavunglanhtho-create.component";
import { QuocgiavavunglanhthoEditComponent } from "./edit/quocgiavavunglanhtho-edit.component";

@Injectable({ providedIn: 'root' })
export class QuocgiavavunglanhthoResolve implements Resolve<IUser | null> {
    constructor(private service: QuocgiavavunglanhthoService) {}
  
    resolve(route: ActivatedRouteSnapshot): Observable<IUser | null> {
      const maQG = route.params['maQG'];
      if (maQG) {
        return this.service.find(maQG);
      }
      return of(null);
    }
}
  
export const quocgiavavunglanhthoRoute: Routes = [
    {
        path: '',
        component: QuocgiavavunglanhthoComponent,
        data: {
            defaultSort: 'maQG,asc'
        }
    },
    {
        path: 'create',
        component: QuocgiavavunglanhthoCreateComponent,
        resolve: {
            user: QuocgiavavunglanhthoResolve
        }
    },
    {
        path: 'edit/:maQG',
        component: QuocgiavavunglanhthoEditComponent,
        resolve: {
            user: QuocgiavavunglanhthoResolve
        }
    }
]