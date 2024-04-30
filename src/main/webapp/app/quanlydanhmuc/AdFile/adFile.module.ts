import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { AlertModuleCheck } from 'app/alertNew/alertNew.module';

import { AdFileManagementRoute } from './adFile.route';
import { AdFileManagementComponent } from './list/list.component';
import { newAdFileComponent } from './create/create.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AdFileDeleteDialogComponent } from './delete/delete.component';



@NgModule({
    imports: [SharedModule, MatIconModule, MatChipsModule, MatDividerModule, MatCardModule, RouterModule.forChild(AdFileManagementRoute), AlertModuleCheck],
    declarations: [
        AdFileManagementComponent,
        newAdFileComponent,
        AdFileDeleteDialogComponent,
    ],
})
export class AdFileManagementModule { }