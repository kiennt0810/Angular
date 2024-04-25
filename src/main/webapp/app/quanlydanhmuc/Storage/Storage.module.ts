import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { AlertModuleCheck } from 'app/alertNew/alertNew.module';

import { StorageManagementRoute } from './Storage.route';
import { StorageManagementComponent } from './Storage-list/list.component';
import { newStorageComponent } from './Storage-create/create.component';
import { StorageUpdateComponent } from './Storage-update/update.component';
import { StorageDeleteDialogComponent } from './Storage-delete/delete.component';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(StorageManagementRoute), AlertModuleCheck],
    declarations: [
        StorageManagementComponent,
        newStorageComponent,
        StorageUpdateComponent,
        StorageDeleteDialogComponent,
    ],
})
export class StorageManagementModule { }