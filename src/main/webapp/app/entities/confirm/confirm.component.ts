import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { ConfirmService } from './confirm.service';
import { AlertService } from 'app/core/util/alert.service';
// import { ColumnMode } from 'projects/swimlane/ngx-datatable/src/public-api';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'jhi-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent implements OnInit {
  icon: any = {
    faEdit: faEdit,
  };
  rows: any = [];

  filter = new FormGroup({
    keyword: new FormControl(''),
  });

  ColumnMode = ColumnMode;
  constructor(private confirmService: ConfirmService, private toast: AlertService) {}

  ngOnInit() {
    this.getlist();
  }

  handerfilter() {}

  getlist() {
    let data: any = {
      keyword: this.filter.value?.keyword,
    };
    this.confirmService.getlist(data).subscribe({
      next: res => {
        // this.toast.addAlert({ message: 'Đăng ký thành công', type: 'success', toast: true });
        this.rows = res;
        this.rows.map((obj, index) => {
          obj.stt = index + 1;
        });
      },
      error: error => this.toast.addAlert({ message: `${error}`, type: 'danger', toast: true }),
    });
  }

  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', './data.json');

    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };

    req.send();
  }

  handerconfirm(item: any) {
    const code = item.activeCode;
    this.confirmService.active({ key: item.id, code }).subscribe({
      next: response => {
        console.log('response', response);
        const code = response.code;
        if (code === 'activated_regisFree' || code === 'activated_regisPay') {
          this.toast.addAlert({ translationKey: 'regconfirm.home.activeSuccess', type: 'success', toast: true });
          // setting active == true
          // this.registerOrders.find(rg => rg.id === id).activate = true;
        } else if (code === 'validations.error.activecodenotcorrect') {
          this.toast.addAlert({ translationKey: 'regconfirm.home.activeCodeNotCorrect', type: 'warning', toast: true });
        } else if (code === 'validations.error.activecodeinactive') {
          this.toast.addAlert({ translationKey: 'regconfirm.home.activeCodeInactive', type: 'warning', toast: true });
        } else if (code === 'validations.error.emailactivateduplicate') {
          this.toast.addAlert({ translationKey: 'regconfirm.home.activeDuplicate', type: 'warning', toast: true });
        } else if (code === 'validations.error.emailisexist') {
          // email register da ton tai
          this.toast.addAlert({ translationKey: 'regconfirm.home.emailuserloginduplicate', type: 'warning', toast: true });
        } else if (code === 'validations.error.emailuserloginduplicate') {
          // email cua user ton tai
          this.toast.addAlert({ translationKey: 'regconfirm.home.emailuserloginduplicate', type: 'warning', toast: true });
        } else {
          this.toast.addAlert({ translationKey: 'regconfirm.home.activeError', type: 'warning', toast: true });
        }
        // this.toast.addAlert({ message: 'Xác nhận thành công', type: 'success', toast: true });
      },
      error: error => {
        this.toast.addAlert({ translationKey: 'regconfirm.home.activeEx', type: 'danger', toast: true });
      },
    });
  }
}
