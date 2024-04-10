import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DelegationIn } from '../doanVao.model';
import { CategoriesManagementService } from '../service/categories-management.service';

@Component({
  selector: 'jhi-user-mgmt-delete-dialog',
  templateUrl: './categories-management-delete-dialog.component.html',
})
export class CategoriesManagementDeleteDialogComponent {
  user?: DelegationIn;

  constructor(private userService: CategoriesManagementService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(maDoan: string): void {
    this.userService.delete(maDoan).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
