import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "app/shared";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ChangePasswordComponent } from "./ChangePassword.component";
import { ChangePasswordRoute } from "./ChangePassword.route";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AlertModuleCheck } from "app/alertNew/alertNew.module";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(ChangePasswordRoute),
        CommonModule,
        FormsModule,
        MatCheckboxModule,
        AlertModuleCheck
    ],
    declarations: [ChangePasswordComponent],
    exports: [ChangePasswordComponent],
})
export class ChangePasswordModule {}