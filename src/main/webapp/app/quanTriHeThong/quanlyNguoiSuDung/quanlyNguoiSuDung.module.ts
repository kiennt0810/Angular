import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "app/shared";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { QuanLyNguoiSuDungComponent } from "./list/quanlynguoisudung.component";
import { QuanLyNguoiSuDungDeleteDialogComponent } from "./delete/quanlynguoisudung-delete.component";
import { quanlynguoisudungRoute } from "./quanlynguoisudung.route";
import { QuanLyNguoiSuDungCreateComponent } from "./create/quanlynguoisudung-create.component";
import { QuanLyNguoiSuDungEditComponent } from "./edit/quanlynguoisudung-edit.component";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { AlertModuleCheck } from "app/alertNew/alertNew.module";


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(quanlynguoisudungRoute),
        CommonModule, FormsModule,
        BsDatepickerModule.forRoot(),
        AlertModuleCheck
    ],
    exports: [QuanLyNguoiSuDungComponent],
    declarations: [
        QuanLyNguoiSuDungComponent,
        QuanLyNguoiSuDungCreateComponent,
        QuanLyNguoiSuDungEditComponent,
        QuanLyNguoiSuDungDeleteDialogComponent
    ],
})
export class QuanLyNguoiSuDungModule {}