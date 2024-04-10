import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { AlertModuleCheck } from "../alertNew/alertNew.module";

@NgModule({
    declarations: [HomeComponent],
    imports: [RouterModule.forChild([HOME_ROUTE]), AlertModuleCheck]
})
export class HomeModule {}
