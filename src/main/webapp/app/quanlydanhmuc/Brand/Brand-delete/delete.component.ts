import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BrandService } from '../Brand.service';
import { Brand } from '../Brand.model';


@Component({
  selector: 'jhi-mgmt-delete-dialog',
  templateUrl: './delete.component.html',
})
export class BrandDeleteDialogComponent {
    brand?: Brand;

  constructor(private BrandService: BrandService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(color: string): void {
    this.BrandService.delete(this.brand.id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
