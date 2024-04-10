import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { GiaoNhanHC } from '../giaoNhanHC.model';
import { GiaoNhanHCService } from '../service/giaoNhanHC.service';

@Component({
  selector: 'delete-GNHC',
  templateUrl: './giaoNhanHC-delete.component.html',
})
export class DeleteGNHcDialogComponent {
    hoChieu?: GiaoNhanHC;

  constructor(private Service: GiaoNhanHCService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(): void {
    this.Service.delete(this.hoChieu.id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
