import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { KiemTraHCComponent } from './kiemTraHC-list/kiemTraHC.component';
// import { PassportDetailComponent } from './detail-passport/passport-detail.component';
//import { HCNgoaiGiaoUpdateComponent } from './quanLyHCNgoaiGiao-update/hoCNgoaiGiao-update.component';
// import { PassportDeleteDialogComponent } from './delete-passport/passport-delete.component';
//import { newGNHCComponent } from './kienTraHC-new/giaoNhanHC-new.component';
import { KiemTraHCManagementRoute } from './kiemTraHC.route';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { AlertModuleCheck } from 'app/alertNew/alertNew.module';

@NgModule({
  imports: [SharedModule, NgbDatepickerModule, MatIconModule, MatChipsModule, MatDividerModule, MatCardModule, RouterModule.forChild(KiemTraHCManagementRoute),AlertModuleCheck],
  declarations: [
    KiemTraHCComponent,
    // PassportDetailComponent,
    //HCNgoaiGiaoUpdateComponent,
    // PassportDeleteDialogComponent,
    //newGNHCComponent,
  ],
})
export class KTHCManagementModule {}