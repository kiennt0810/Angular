import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChucVuService } from '../ChucVu.service';
import { ChucVu } from '../ChucVu.model';


@Component({
  selector: 'jhi-passport-mgmt-delete-dialog',
  templateUrl: './ChucVu-delete.component.html',
})
export class ChucVuDeleteDialogComponent {
    ChucVu?: ChucVu;

  constructor(private ChucVuService: ChucVuService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(passport: string): void {
    this.ChucVuService.delete(this.ChucVu.id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
