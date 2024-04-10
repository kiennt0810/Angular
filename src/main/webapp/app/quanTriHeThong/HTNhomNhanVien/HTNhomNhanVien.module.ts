import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "app/shared";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HTNhomNhanVienComponent } from "./list/HTNhomNhanVien.component";
import { HTNhomNhanVienRoute } from "./HTNhomNhanVien.route";
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SearchNhomComponent } from "./searchNhom/searchNhom.component";
import { AlertModuleCheck } from "app/alertNew/alertNew.module";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(HTNhomNhanVienRoute),
        CommonModule,
        FormsModule,
        HTNhomNhanVienComponent,
        MatCheckboxModule,
        AlertModuleCheck
    ],
    exports: [HTNhomNhanVienComponent],
    declarations: [SearchNhomComponent]
})
export class HTNhomNhanVienModule {}