import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { AlertModuleCheck } from 'app/alertNew/alertNew.module';

import { ColorManagementRoute } from './Color.route';
import { ColorManagementComponent } from './Color-list/Color-list.component';
import { newColorComponent } from './Color-create/Create.component';
import { ColorUpdateComponent } from './Color-update/Update.component';
import { ColorDeleteDialogComponent } from './Color-delete/Delete.component';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(ColorManagementRoute), AlertModuleCheck],
    declarations: [
        ColorManagementComponent,
        newColorComponent,
        ColorUpdateComponent,
        ColorDeleteDialogComponent,
    ],
})
export class ColorManagementModule { }