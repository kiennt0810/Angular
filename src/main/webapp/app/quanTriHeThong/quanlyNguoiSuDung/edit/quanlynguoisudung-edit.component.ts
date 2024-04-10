import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser, User } from '../quanlynguoisudung.model';
import { QuanLyNguoiSuDungService } from '../quanlynguoisudung.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'app/core/util/alert.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import moment from 'moment';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const userTemplate = {} as IUser;
declare var $: any;
@Component({
  selector: 'jhi-user-mgmt-detail',
  templateUrl: './quanlynguoisudung-edit.component.html',
  styleUrls: ['./quanlynguoisudung-edit.component.scss', '../../quantrihethong.component.scss']
})
export class QuanLyNguoiSuDungEditComponent implements OnInit {
  user: User | null = null;
  authorities: string[] = [];
  isSaving = false;
  originalValue: string;
  showWarning = false;
  showError = false;
  currentPath: string;

  
  editForm = new FormGroup({
    id: new FormControl(userTemplate.id),
    hoTen: new FormControl(userTemplate.hoTen, { validators: [Validators.required,] }),
    maNhanVien: new FormControl(userTemplate.maNhanVien, { validators: [Validators.required,] }),
    matKhau: new FormControl(userTemplate.matKhau),
    email: new FormControl(userTemplate.email, {
      nonNullable: true,
      validators: [Validators.required,Validators.minLength(5), Validators.maxLength(254), Validators.email, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)],
    }),
    ngaySinh: new FormControl(userTemplate.ngaySinh, { validators: [Validators.maxLength(10)] }),
    gioiTinh: new FormControl(userTemplate.gioiTinh),
    chucDanh: new FormControl(userTemplate.chucDanh),
    tinhTrang: new FormControl(userTemplate.tinhTrang),
    createdBy: new FormControl(userTemplate.createdBy),
    updatedBy: new FormControl(userTemplate.updatedBy),
    createdDate: new FormControl(userTemplate.createdDate),
    updatedDate: new FormControl(userTemplate.updatedDate),

    // activated: new FormControl(userTemplate.activated, { nonNullable: true }),
    // langKey: new FormControl(userTemplate.langKey, { nonNullable: true }),
    // authorities: new FormControl(userTemplate.authorities, { nonNullable: true }),
  });

  constructor(
    private userService: QuanLyNguoiSuDungService,
    private route: ActivatedRoute,
    private alert: AlertServiceCheck,
    private router: Router,
    private navbarService: NavBarService
  ) { }

  ngOnInit(): void {
    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Sửa')
    const id = this.route.snapshot.params.id;
    this.userService.getCurrentData(id).subscribe((result) => {
      this.editForm = new FormGroup({
        id: new FormControl(result['id']),
        hoTen: new FormControl(result['hoTen'],{ validators: [Validators.required,] }),
        maNhanVien: new FormControl(result['maNhanVien']),
        matKhau: new FormControl(result['matKhau']),
        email: new FormControl(result['email'], {
          nonNullable: true,
          validators: [Validators.required,Validators.minLength(5), Validators.maxLength(254), Validators.email, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)],
        }),
        ngaySinh: new FormControl(result['ngaySinh'], { validators: [Validators.maxLength(10)] }),
        gioiTinh: new FormControl(result['gioiTinh']),
        chucDanh: new FormControl(result['chucDanh']),
        tinhTrang: new FormControl(result['tinhTrang']),
        createdBy: new FormControl(result['createdBy']),
        updatedBy: new FormControl(result['updatedBy']),
        createdDate: new FormControl(result['createdDate']),
        updatedDate: new FormControl(result['updatedDate']),
      })
    })
  }
  
  previousState(): void {
    window.history.back();
  }

  checkDateNgay(event) {
    let ngaySinh = event;
    if (ngaySinh >= new Date()) {
      $('#ngaySinh').focus();
      this.isSaving = true;
      this.showError = true;
      this.showWarning = false
    } else {
      this.isSaving = false;
      this.showError = false;
      this.showWarning = false
    }
    
  }

  isInvalidDate(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.showWarning = true
      event.target.value = null
    } else {
      this.showWarning = false
    }
  }

  save(): void {
    this.isSaving = true;
    const user = this.editForm.getRawValue();
    user.hoTen = user.hoTen.trim();
    user.maNhanVien = user.maNhanVien.trim();
    user.email = user.email.trim();
    let date: any = new Date();
    date = moment(date).format("DD/MM/YYYY");
    (user.ngaySinh = $('#ngaySinh').first().val())

    if (user.ngaySinh > date) {
      this.showError = true;
      this.isSaving = false
    } else {
      if (user.id !== null) {
        this.userService.update(user).subscribe({
          next: () => this.onSaveSuccess(),
          error:response => this.onSaveError(response),
        });
      } 
    }
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
    this.alert.success('Sửa thành công');    }

  private onSaveError(response: HttpErrorResponse): void {
    this.isSaving = false;
    if (response.status !== 200) {
      this.alert.error('Sửa không thành công');    }
  }
}
