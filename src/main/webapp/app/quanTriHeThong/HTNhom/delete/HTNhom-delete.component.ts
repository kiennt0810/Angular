import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { HTNhomService } from '../HTNhom.service';
import { User } from '../HTNhom.model';

@Component({
  selector: 'jhi-HTNhom-delete-dialog',
  templateUrl: './HTNhom-delete.component.html',
})
export class HTNhomDeleteDialogComponent {
  user?: User;

  constructor(private userService: HTNhomService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(user: any): void {
    this.userService.delete(this.user.id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
