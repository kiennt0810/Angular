import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/core/util/alert.service';
import { ModalChangePasswordComponent } from '../modal-change-password/modal-change-password.component';

@Component({
  selector: 'jhi-modal-configuration',
  templateUrl: './modal-configuration.component.html',
  styleUrls: ['./modal-configuration.component.scss'],
})
export class ModalConfigurationComponent implements OnInit {
  constructor(public modal: NgbActiveModal, private toast: AlertService, private modalService: NgbModal) {}

  ngOnInit(): void {}

  save() {}

  opentModalChangePassword() {
    const dialogRef = this.modalService.open(ModalChangePasswordComponent, {
      size: 'lg',
      centered: true,
    });
    dialogRef.result.then(
      result => {
        console.log('Closed');
      },
      reason => {
        console.log('Dismissed');
      }
    );
  }

  close() {
    this.modal.close();
  }

  dismiss() {
    this.modal.dismiss();
  }
}
