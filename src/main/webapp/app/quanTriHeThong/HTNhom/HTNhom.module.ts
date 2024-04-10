import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "app/shared";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HTNhomComponent } from "./list/HTNhom.component";
import { HTNhomDeleteDialogComponent } from "./delete/HTNhom-delete.component";
import { HTNhomRoute } from "./HTNhom.route";
import { HTNhomCreateComponent } from "./create/HTNhom-create.component";
import { HTNhomEditComponent } from "./edit/HTNhom-edit.component";
import { AlertModuleCheck } from "app/alertNew/alertNew.module";


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(HTNhomRoute),
        CommonModule,
        FormsModule,
        AlertModuleCheck
    ],
    exports: [HTNhomComponent],
    declarations: [
        HTNhomComponent,
        HTNhomCreateComponent,
        HTNhomEditComponent,
        HTNhomDeleteDialogComponent
    ],
})
export class HTNhomModule {}