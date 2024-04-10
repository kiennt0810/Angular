import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/core/util/alert.service';

@Component({
  selector: 'jhi-modal-confirm-delete-digital-certificate',
  templateUrl: './modal-confirm-delete-digital-certificate.component.html',
  styleUrls: ['./modal-confirm-delete-digital-certificate.component.scss'],
})
export class ModalConfirmDeleteDigitalCertificateComponent implements OnInit {
  constructor(public modal: NgbActiveModal, private toast: AlertService) {}

  ngOnInit(): void {}

  save() {}

  close() {
    this.modal.close();
  }

  dismiss() {
    this.modal.dismiss();
  }
}
