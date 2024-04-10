import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalAccountRoutingModule } from './personal-account-routing.module';
import { PersonalAccountComponent } from './personal-account.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalChangePasswordComponent } from './modal/modal-change-password/modal-change-password.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalCeaterDigitalCertificateComponent } from './modal/modal-ceater-digital-certificate/modal-ceater-digital-certificate.component';
import { ModalConfigurationComponent } from './modal/modal-configuration/modal-configuration.component';
import { ModalConfirmDeleteDigitalCertificateComponent } from './modal/modal-confirm-delete-digital-certificate/modal-confirm-delete-digital-certificate.component';
import { DigitalCertificateComponent } from './component/digital-certificate/digital-certificate.component';

@NgModule({
  declarations: [
    PersonalAccountComponent,
    ModalChangePasswordComponent,
    DigitalCertificateComponent,
    ModalCeaterDigitalCertificateComponent,
    ModalConfigurationComponent,
    ModalConfirmDeleteDigitalCertificateComponent,
  ],
  imports: [FormsModule, CommonModule, PersonalAccountRoutingModule, NgbNavModule, ReactiveFormsModule, NgxDatatableModule],
})
export class PersonalAccountModule {}
