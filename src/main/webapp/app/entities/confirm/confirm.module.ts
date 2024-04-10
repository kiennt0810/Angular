import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmRoutingModule } from './confirm-routing.module';
import { ConfirmComponent } from './confirm.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ConfirmComponent],
  imports: [CommonModule, ConfirmRoutingModule, NgxDatatableModule, FontAwesomeModule, FormsModule, ReactiveFormsModule],
})
export class ConfirmModule {}
