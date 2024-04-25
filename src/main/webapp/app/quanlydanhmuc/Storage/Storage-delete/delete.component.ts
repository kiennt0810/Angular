import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from '../Storage.service';
import { Storage } from '../Storage.model';


@Component({
  selector: 'jhi-mgmt-delete-dialog',
  templateUrl: './delete.component.html',
})
export class StorageDeleteDialogComponent {
    storage?: Storage;

  constructor(private StorageService: StorageService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(color: string): void {
    this.StorageService.delete(this.storage.id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
