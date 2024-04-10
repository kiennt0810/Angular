import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/core/util/alert.service';

@Component({
  selector: 'jhi-modal-ceater-digital-certificate',
  templateUrl: './modal-ceater-digital-certificate.component.html',
  styleUrls: ['./modal-ceater-digital-certificate.component.scss'],
})
export class ModalCeaterDigitalCertificateComponent implements OnInit {
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
