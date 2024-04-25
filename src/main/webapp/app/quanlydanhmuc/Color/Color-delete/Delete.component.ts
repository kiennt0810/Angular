import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ColorService } from '../Color.service';
import { Color } from '../Color.model';


@Component({
  selector: 'jhi-mgmt-delete-dialog',
  templateUrl: './Delete.component.html',
})
export class ColorDeleteDialogComponent {
    color?: Color;

  constructor(private ColorService: ColorService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(color: string): void {
    this.ColorService.delete(this.color.id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
