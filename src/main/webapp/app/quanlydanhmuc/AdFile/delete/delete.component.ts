import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdFileService } from '../adFile.service';
import { AdFile } from '../adFile.model';


@Component({
  selector: 'jhi-mgmt-delete-dialog',
  templateUrl: './delete.component.html',
})
export class AdFileDeleteDialogComponent {
    adFile?: AdFile;

  constructor(private AdFileService: AdFileService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(): void {
    this.AdFileService.delete(this.adFile.id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
