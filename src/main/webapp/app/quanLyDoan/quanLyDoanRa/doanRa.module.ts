import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { delegationOutManagementRoute } from './doanRa.route';
import { MatIconModule } from '@angular/material/icon';

import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { DoanRaComponent } from './list/doanRaList.component';
import { DoanRaCreateComponent } from './new/create.component';
import { DoanRaEditComponent } from './edit/edit.component';
import { DoanRaViewComponent } from './view/view.component';
import { DoanRaDeleteDialogComponent } from './delete/delete-dialog.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ListTVComponent } from './list-tv/list-tv.component';
import { AlertModuleCheck } from 'app/alertNew/alertNew.module';

@NgModule({
  imports: [SharedModule, MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    RouterModule.forChild(delegationOutManagementRoute),
    BsDatepickerModule.forRoot(),
    AlertModuleCheck
  ],
  declarations: [
    DoanRaComponent,
    DoanRaCreateComponent,
    DoanRaEditComponent,
    DoanRaViewComponent,
    DoanRaDeleteDialogComponent,
    ListTVComponent
  ],
})
export class DelegationOutManagementModule {}
