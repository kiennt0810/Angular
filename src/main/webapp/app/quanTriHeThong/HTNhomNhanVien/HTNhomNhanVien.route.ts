import { ActivatedRouteSnapshot, Resolve, Routes } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HTNhomNhanVienService } from "./HTNhomNhanVien.service";
import { HTNhomNhanVienComponent } from "./list/HTNhomNhanVien.component";
import { HomeComponent } from "app/home/home.component";

  
export const HTNhomNhanVienRoute: Routes = [
    {
        path: '',
        component: HTNhomNhanVienComponent,
    },
]