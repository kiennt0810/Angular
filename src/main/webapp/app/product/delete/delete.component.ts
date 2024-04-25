import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../product.service';
import { Product } from '../product.model';


@Component({
  selector: 'jhi-mgmt-delete-dialog',
  templateUrl: './delete.component.html',
})
export class ProductDeleteDialogComponent {
    product?: Product;

  constructor(private ProductService: ProductService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(product: string): void {
    this.ProductService.delete(this.product.id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
