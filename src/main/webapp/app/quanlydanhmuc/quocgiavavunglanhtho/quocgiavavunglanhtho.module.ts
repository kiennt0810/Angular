import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { quocgiavavunglanhthoRoute } from "./quocgiavavunglanhtho.route";
import { QuocgiavavunglanhthoComponent } from "./list/quocgiavavunglanhtho.component";
import { SharedModule } from "app/shared";
import { CommonModule } from "@angular/common";
import { QuocgiavavunglanhthoCreateComponent } from "./create/quocgiavavunglanhtho-create.component";
import { QuocgiavavunglanhthoEditComponent } from "./edit/quocgiavavunglanhtho-edit.component";
import { FormsModule } from "@angular/forms";
import { QuocgiavavunglanhthoDeleteDialogComponent } from "./delete/quocgiavavunglanhtho-delete.component";
import { AlertModuleCheck } from "app/alertNew/alertNew.module";


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(quocgiavavunglanhthoRoute),
        CommonModule,
        FormsModule,
        AlertModuleCheck
    ],
    exports: [QuocgiavavunglanhthoComponent],
    declarations: [
        QuocgiavavunglanhthoComponent,
        QuocgiavavunglanhthoCreateComponent,
        QuocgiavavunglanhthoEditComponent,
        QuocgiavavunglanhthoDeleteDialogComponent
    ],
})
export class QuocgiavavunglanhthoModule {}