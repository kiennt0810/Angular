import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/core/util/alert.service';

@Component({
  selector: 'jhi-modal-change-password',
  templateUrl: './modal-change-password.component.html',
  styleUrls: ['./modal-change-password.component.scss'],
})
export class ModalChangePasswordComponent implements OnInit {
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
