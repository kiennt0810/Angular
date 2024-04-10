import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { QuanLyNguoiSuDungService } from '../quanlynguoisudung.service';
import { User } from '../quanlynguoisudung.model';

@Component({
  selector: 'jhi-quanlynguoisudung-delete-dialog',
  templateUrl: './quanlynguoisudung-delete.component.html',
})
export class QuanLyNguoiSuDungDeleteDialogComponent {
  user?: User;

  constructor(private userService: QuanLyNguoiSuDungService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(user: any): void {
    this.userService.delete(this.user.id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
