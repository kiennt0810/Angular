import { ActivatedRouteSnapshot, Resolve, Routes } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ChangePasswordService } from "./ChangePassword.service";
import { ChangePasswordComponent } from "./ChangePassword.component";
import { HomeComponent } from "app/home/home.component";

  
export const ChangePasswordRoute: Routes = [
    {
        path: '',
        component: ChangePasswordComponent,
    },
]