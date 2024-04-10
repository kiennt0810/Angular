import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { QuanLyTV } from '../quanLyTVRa.model';
import { QuanLyTVService } from '../service/quanLyTVRa.service';

@Component({
  selector: 'jhi-user-mgmt-delete-dialog',
  templateUrl: './quanLyTV-delete-dialog.component.html',
})
export class quanLyTVDeleteDialogComponent {
  user?: QuanLyTV;

  constructor(private userService: QuanLyTVService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(login: string): void {
    this.userService.delete(login).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
