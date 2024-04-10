import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IUser, User } from './ChangePassword.model';
import { ChangePasswordService } from './ChangePassword.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const userTemplate = {} as IUser;

@Component({
  selector: 'jhi-changepassword',
  templateUrl: './ChangePassword.component.html',
  styleUrls: ['./ChangePassword.component.scss', '../quantrihethong.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  user: User = null;
  authorities: string[] = [];
  isSaving = false;
  fieldTextType1: boolean = false;
  fieldTextType2: boolean = false;
  fieldTextType3: boolean = false;
  currentPath: string;


  id = this.accountService.getAccount().id;
  maNhanVien = this.accountService.getAccount().maNhanVien;
  matKhauHienTai = this.accountService.getAccount().matKhau;
  chucDanh = '';
  hoTen = '';
  tinhTrang = true;
  email = ''
  ngaySinh = ''
  gioiTinh = true
  matKhau = new FormControl(userTemplate.matKhau, { validators: [Validators.required, Validators.minLength(6)] })
  matKhauMoi = new FormControl(userTemplate.matKhauMoi, { validators: [Validators.required, Validators.minLength(6)] })
  confirmPassword = new FormControl(null, { validators: [Validators.required, Validators.minLength(6)] })
  // activated: new FormControl(userTemplate.activated, { nonNullable: true }),
  // langKey: new FormControl(userTemplate.langKey, { nonNullable: true }),
  // authorities: new FormControl(userTemplate.authorities, { nonNullable: true }),

  editForm = this.formBuilder.group(
    {
      id: this.id,
      maNhanVien: this.maNhanVien,
      chucDanh: this.chucDanh,
      hoTen: this.hoTen,
      tinhTrang: this.tinhTrang,
      email: this.email,
      ngaySinh: this.ngaySinh,
      gioiTinh: this.gioiTinh,
      matKhau: this.matKhau,
      matKhauMoi: this.matKhauMoi,
      confirmPassword: this.confirmPassword
    },
    {
      validator: this.ConfirmedValidator('matKhauMoi', 'confirmPassword'),
    }
  )

  constructor(
    private userService: ChangePasswordService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alert: AlertServiceCheck,
    private accountService: AccountService,
    private NavbarService: NavBarService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.currentPath = this.router.url;
      this.NavbarService.getPath(this.currentPath);
  }

  previousState(): void {
    window.history.back();
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.ConfirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true })
      } else {
        matchingControl.setErrors(null)
      }
    }
  }

  save(): void {
    const { confirmPassword, ...data } = this.editForm.getRawValue()
    this.user = data;
    if (String(this.user.matKhauMoi) == '12345678') {
      this.alert.warn('Mật khẩu mới không được giống với mật khẩu mặc định');
    } else if(String(atob(this.matKhauHienTai)) == String(this.user.matKhauMoi.trim())) {
      this.alert.warn('Mật khẩu mới không được giống với mật khẩu hiện tại');
    } else {
      this.userService.create(this.user).subscribe({
        next: () => this.onSaveSuccess(),
        error: response => this.onSaveError(response),
      })
    }

  }

  private onSaveSuccess(): void {
    // this.isSaving = false
    // this.previousState();
    this.alert.success('Thay đổi mật khẩu thành công');
  }

  private onSaveError(response: HttpErrorResponse): void {
    this.isSaving = false;
    if (response.status == 404) {
      this.alert.error('Mật khẩu không chính xác');
    } else if (response.status !== 200) {
      this.alert.error('Thay đổi mật khẩu không thành công');
    }
  }

  isHidden1: boolean = false;
  isHidden2: boolean = false;
  isHidden3: boolean = false;
  showDiv1() {
    this.isHidden1 = false;   // Show the div
  }
  hideDiv1() {
    this.isHidden1 = true;  //  Hide the div
  }
  showDiv2() {
    this.isHidden2 = false;   // Show the div
  }
  hideDiv2() {
    this.isHidden2 = true;  //  Hide the div
  }
  showDiv3() {
    this.isHidden3 = false;   // Show the div
  }
  hideDiv3() {
    this.isHidden3 = true;  //  Hide the div
  }
}
