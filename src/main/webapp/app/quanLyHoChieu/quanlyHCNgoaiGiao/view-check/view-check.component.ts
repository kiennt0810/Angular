import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { HoChieuNgoaiGiao } from '../hoCNgoaiGiao.model';
import { Router } from '@angular/router';

@Component({
  selector: 'delete-HCNG',
  templateUrl: './view-check.component.html',
})
export class ViewCheckComponent {
    hoChieu?: HoChieuNgoaiGiao;

  constructor(private activeModal: NgbActiveModal,private router: Router) {}

  cancel(): void {
    this.activeModal.dismiss();
  }
  view(soHC) {
    this.router.navigate(['/HoChieu/quanlyHCNgoaiGiao/view', soHC]);
    this.activeModal.close('deleted');
  }
}
