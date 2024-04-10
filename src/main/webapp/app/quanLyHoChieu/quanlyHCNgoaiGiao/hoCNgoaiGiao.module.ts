import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HChieuNGComponent } from './quanLyHCNgoaiGiao-list/hoCNgoaiGiao.component';
import { HCNgoaiGiaoUpdateComponent } from './quanLyHCNgoaiGiao-update/hoCNgoaiGiao-update.component';
import { HCNGDeleteDialogComponent } from './quanLyHCNgoaiGiao-delete/hoCNG-delete.component';
import { newHCNgoaiGiaoComponent } from './quanLyHCNgoaiGiao-new/hoCNgoaiGiao-new.component';
import { HChieuNGManagementRoute } from './hoCNgoaiGiao.route';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { HCNgoaiGiaoViewComponent } from './quanLyHCNgoaiGiao-view/HCNG-view.component';
import { DeleteCheckComponent } from './delete-check/delete-check.component';

import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AlertModuleCheck } from 'app/alertNew/alertNew.module';
import { ViewCheckComponent } from './view-check/view-check.component';

@NgModule({
  imports: [SharedModule, NgbDatepickerModule, MatIconModule, MatChipsModule, MatDividerModule, MatCardModule,BsDatepickerModule.forRoot(), RouterModule.forChild(HChieuNGManagementRoute),AlertModuleCheck],
  declarations: [
    HChieuNGComponent,
    HCNGDeleteDialogComponent,
    HCNgoaiGiaoUpdateComponent,
    HCNgoaiGiaoViewComponent,
    newHCNgoaiGiaoComponent,
    DeleteCheckComponent,
    ViewCheckComponent,
  ],
})
export class HChieuNGManagementModule { }