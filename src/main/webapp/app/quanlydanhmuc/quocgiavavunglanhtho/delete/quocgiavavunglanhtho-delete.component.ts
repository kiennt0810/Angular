import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '../quocgiavavunglanhtho.model';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';

@Component({
  selector: 'jhi-quocgia-vunglanhtho-delete-dialog',
  templateUrl: './quocgiavavunglanhtho-delete.component.html',
})
export class QuocgiavavunglanhthoDeleteDialogComponent {
  user?: User;

  constructor(private userService: QuocgiavavunglanhthoService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(user: any): void {
    this.userService.delete(this.user.maQG).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
