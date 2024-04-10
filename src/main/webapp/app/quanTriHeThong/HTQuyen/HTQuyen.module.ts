import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "app/shared";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HTQuyenComponent } from "./list/HTQuyen.component";
import { HTQuyenRoute } from "./HTQuyen.route";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AlertModuleCheck } from "app/alertNew/alertNew.module";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(HTQuyenRoute),
        CommonModule,
        FormsModule,
        HTQuyenComponent,
        MatCheckboxModule,
        AlertModuleCheck
    ],
    exports: [HTQuyenComponent],
})
export class HTQuyenModule {}