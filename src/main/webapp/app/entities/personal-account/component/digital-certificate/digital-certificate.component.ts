import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ModalCeaterDigitalCertificateComponent } from '../../modal/modal-ceater-digital-certificate/modal-ceater-digital-certificate.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfigurationComponent } from '../../modal/modal-configuration/modal-configuration.component';
import { ModalConfirmDeleteDigitalCertificateComponent } from '../../modal/modal-confirm-delete-digital-certificate/modal-confirm-delete-digital-certificate.component';

@Component({
  selector: 'jhi-digital-certificate',
  templateUrl: './digital-certificate.component.html',
  styleUrls: ['./digital-certificate.component.scss'],
})
export class DigitalCertificateComponent implements OnInit {
  rows: any = [
    {
      id: 0,
      name: 'Nguyễn Văn A',
      note: 'skajdhfasjhdfkjashdflkjashdflkjhasdkjfh',
    },
  ];

  ColumnMode = ColumnMode;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  getlist() {
    // let data: any = {
    //   keyword: this.filter.value?.keyword,
    // };
    // this.confirmService.getlist(data).subscribe({
    //   next: res => {
    //     // this.toast.addAlert({ message: 'Đăng ký thành công', type: 'success', toast: true });
    //     this.rows = res;
    //     this.rows.map((obj, index) => {
    //       obj.stt = index + 1;
    //     });
    //   },
    //   error: error => this.toast.addAlert({ message: `${error}`, type: 'danger', toast: true }),
    // });
  }

  opentModalCeaterDigitalCertificate() {
    const dialogRef = this.modalService.open(ModalCeaterDigitalCertificateComponent, {
      size: 'lg',
      centered: true,
    });
    dialogRef.result.then(
      result => {
        console.log('Closed');
      },
      reason => {
        console.log('Dismissed');
      }
    );
  }

  opentModalConfiguration() {
    const dialogRef = this.modalService.open(ModalConfigurationComponent, {
      size: 'md',
      centered: true,
    });
    dialogRef.result.then(
      result => {
        console.log('Closed');
      },
      reason => {
        console.log('Dismissed');
      }
    );
  }

  opentModalConfirmDeleteDigitalCertificate() {
    const dialogRef = this.modalService.open(ModalConfirmDeleteDigitalCertificateComponent, {
      size: 'lg',
      centered: true,
    });
    dialogRef.result.then(
      result => {
        console.log('Closed');
      },
      reason => {
        console.log('Dismissed');
      }
    );
  }
}
