import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { HoChieuNgoaiGiao } from '../hoCNgoaiGiao.model';
import { HChieuNGService } from '../service/hoCNgoaiGiao.service';

@Component({
  selector: 'delete-HCNG',
  templateUrl: './hoCNG-delete.component.html',
})
export class HCNGDeleteDialogComponent {
    hoChieu?: HoChieuNgoaiGiao;

  constructor(private Service: HChieuNGService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(): void {
    this.Service.delete(this.hoChieu.soHC).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
