import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { AlertModuleCheck } from 'app/alertNew/alertNew.module';
import { PassportManagementComponent } from './list/loaihochieu.component';
import { PassportDetailComponent } from './detail/passport-detail.component';
import { PassportUpdateComponent } from './edit/loaihochieu-update.component';
import { PassportDeleteDialogComponent } from './delete/passport-delete.component';
import { newPassportComponent } from './create/loaihochieu-create.component';
import { PassportManagementRoute } from './loaihochieu.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(PassportManagementRoute), AlertModuleCheck],
  declarations: [
    PassportManagementComponent,
    PassportDetailComponent,
    PassportUpdateComponent,
    PassportDeleteDialogComponent,
    newPassportComponent,
  ],
})
export class PassportManagementModule {}