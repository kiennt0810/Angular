import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AlertModuleCheck } from 'app/alertNew/alertNew.module';
import { CustomerManagementRoute } from './customer.route';
import { CustomerManagementComponent } from './list/list.component';

@NgModule({
  imports: [SharedModule, NgbDatepickerModule, FormsModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule, RouterModule.forChild(CustomerManagementRoute),
    BsDatepickerModule.forRoot(),
    AlertModuleCheck],
  exports: [CustomerManagementComponent,],
  declarations: [
    CustomerManagementComponent
  ]
})
export class CustomerModule { }
