import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { AlertModuleCheck } from 'app/alertNew/alertNew.module';

import { BrandManagementRoute } from './Brand.route';
import { BrandManagementComponent } from './Brand-list/list.component';
import { newBrandComponent } from './Brand-create/create.component';
import { BrandUpdateComponent } from './Brand-update/update.component';
import { BrandDeleteDialogComponent } from './Brand-delete/delete.component';


@NgModule({
    imports: [SharedModule, RouterModule.forChild(BrandManagementRoute), AlertModuleCheck],
    declarations: [
        BrandManagementComponent,
        newBrandComponent,
        BrandUpdateComponent,
        BrandDeleteDialogComponent,
    ],
})
export class BrandManagementModule { }