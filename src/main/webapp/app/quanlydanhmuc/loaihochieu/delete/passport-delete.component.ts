import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PassportService } from '../loaihochieu.service';
import { Passport } from '../loaihochieu.model';


@Component({
  selector: 'jhi-passport-mgmt-delete-dialog',
  templateUrl: './passport-delete.component.html',
})
export class PassportDeleteDialogComponent {
    passport?: Passport;

  constructor(private passportService: PassportService, private activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(passport: string): void {
    this.passportService.delete(this.passport.id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
