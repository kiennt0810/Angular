import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { AlertModuleCheck } from 'app/alertNew/alertNew.module';
import { ChucVuManagementComponent } from './list/ChucVu.component';
// import { PassportDetailComponent } from './detail/passport-detail.component';
import { ChucVuUpdateComponent } from './edit/ChucVu-edit.component';
import { ChucVuDeleteDialogComponent } from './delete/ChucVu-delete.component';
import { newChucVuComponent } from './create/ChucVu-create.component';
import { ChucVuManagementRoute } from './ChucVu.route';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(ChucVuManagementRoute), AlertModuleCheck],
    declarations: [
        ChucVuManagementComponent,
        // PassportDetailComponent,
        ChucVuUpdateComponent,
        ChucVuDeleteDialogComponent,
        newChucVuComponent,
    ],
})
export class ChucVuManagementModule { }