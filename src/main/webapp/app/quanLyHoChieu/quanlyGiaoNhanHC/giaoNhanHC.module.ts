import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { GiaoNhanHCComponent } from './giaoNhanHC-list/giaoNhanHC.component';
// import { PassportDetailComponent } from './detail-passport/passport-detail.component';
//import { HCNgoaiGiaoUpdateComponent } from './quanLyHCNgoaiGiao-update/hoCNgoaiGiao-update.component';
import { DeleteGNHcDialogComponent } from './giaoNhanHC-delete/giaoNhanHC-delete.component';
import { newGNHCComponent } from './giaoNhanHC-new/giaoNhanHC-new.component';
import { updateGNHCComponent } from './giaoNhanHC-update/giaoNhanHC-update.component';
import { GiaoNhanHCManagementRoute } from './giaoNhanHC.route';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SoHCSearchComponent } from './popup/popup.component';
import { AlertModuleCheck } from 'app/alertNew/alertNew.module';

@NgModule({
  imports: [SharedModule, NgbDatepickerModule, MatIconModule, MatChipsModule, MatDividerModule, MatCardModule,BsDatepickerModule.forRoot(), RouterModule.forChild(GiaoNhanHCManagementRoute),AlertModuleCheck],
  declarations: [
    GiaoNhanHCComponent,
    updateGNHCComponent,
    DeleteGNHcDialogComponent,
    newGNHCComponent,
    SoHCSearchComponent,
  ],
})
export class GNHCManagementModule {}