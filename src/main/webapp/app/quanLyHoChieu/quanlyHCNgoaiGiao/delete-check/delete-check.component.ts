import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { HoChieuNgoaiGiao } from '../hoCNgoaiGiao.model';
import { HChieuNGService } from '../service/hoCNgoaiGiao.service';

@Component({
  selector: 'delete-HCNG',
  templateUrl: './delete-check.component.html',
})
export class DeleteCheckComponent {
    hoChieu?: HoChieuNgoaiGiao;

  constructor(private Service: HChieuNGService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }
}
