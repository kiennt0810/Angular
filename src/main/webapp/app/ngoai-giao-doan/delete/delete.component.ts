import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HDNgoaiGiaoVM } from '../HDNgoaiGiaoVM.model';
import { NgoaiGiaoDoanService } from '../service/ngoai-giao-doan.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
@Component({
  selector: 'jhi-user-mgmt-delete-dialog',
  templateUrl: './delete.component.html',
})
export class DeleteComponent {
  user?: HDNgoaiGiaoVM;
  constructor(private Service: NgoaiGiaoDoanService, private activeModal: NgbActiveModal,
    private alert: AlertServiceCheck,) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
      this.alert.success('Xóa thành công');
    });
  }
}
