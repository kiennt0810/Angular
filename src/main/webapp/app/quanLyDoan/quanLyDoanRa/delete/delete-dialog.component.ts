import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DoanRa } from '../doanRa.model';
import { DoanRaService } from '../service/delegation-out.service';


@Component({
  selector: 'jhi-user-mgmt-delete-dialog',
  templateUrl: './delete-dialog.component.html',
})
export class DoanRaDeleteDialogComponent {
  user?: DoanRa;

  constructor(private userService: DoanRaService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(maDoan: number): void {
    this.userService.delete(maDoan).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
