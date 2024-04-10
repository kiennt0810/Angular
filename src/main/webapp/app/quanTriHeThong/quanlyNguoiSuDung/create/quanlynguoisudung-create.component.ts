import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser, User } from '../quanlynguoisudung.model';
import { QuanLyNguoiSuDungService } from '../quanlynguoisudung.service';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { AlertService } from 'app/core/util/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const userTemplate = {} as IUser;
const newUser: IUser = {} as IUser;

declare var $: any;
@Component({
  selector: 'jhi-user-mgmt-detail',
  templateUrl: './quanlynguoisudung-create.component.html',
  styleUrls: ['./quanlynguoisudung-create.component.scss', '../../quantrihethong.component.scss'],
})
export class QuanLyNguoiSuDungCreateComponent implements OnInit {
  user: User | null = null;
  authorities: string[] = [];
  isSaving = false;
  showWarning = false;
  showError = false;
  currentPath: string;


  editForm = new FormGroup({
    id: new FormControl(userTemplate.id = 0),
    hoTen: new FormControl(userTemplate.hoTen, { validators: [Validators.required,] }),
    maNhanVien: new FormControl(userTemplate.maNhanVien, { validators: [Validators.required,] }),
    matKhau: new FormControl(userTemplate.matKhau = Math.random().toString()),
    email: new FormControl(userTemplate.email, {
      nonNullable: true,
      validators: [Validators.required,Validators.minLength(5), Validators.maxLength(254), Validators.email, Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)],
    }),
    ngaySinh: new FormControl(userTemplate.ngaySinh),
    gioiTinh: new FormControl(userTemplate.gioiTinh),
    chucDanh: new FormControl(userTemplate.chucDanh),
    tinhTrang: new FormControl(userTemplate.tinhTrang = true),
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
    private router: Router,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private alert: AlertServiceCheck,
    private navbarService: NavBarService
  ) {
  }

  

  ngOnInit(): void {
    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Thêm Mới')
    // this.userService.authorities().subscribe(authorities => (this.authorities = authorities));
  }

  checkDateNgay(event) {
    let ngaySinh = event;
    if (ngaySinh >= new Date()) {
      this.showError = true;
      $('#ngaySinh').focus();
      this.isSaving = true;
      this.showWarning = false;
    } else {
      this.isSaving = false;
      this.showError = false;
      this.showWarning = false;
    }
  }

  isInvalidDate(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.showWarning = true
      event.target.value = null
      this.isSaving = false
    } else {
      this.showWarning = false
    }
  }

  previousState(): void {
    sessionStorage.removeItem('subName')
    this.router.navigate(['/quantrihethong/quanlynguoisudung'])
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
      this.userService.getUser(user.maNhanVien).subscribe((res: any) => {
        if (res == null) {
          this.userService.create(user).subscribe({
            next: () => this.onSaveSuccess(),
            error:response => this.onSaveError(response),
          });
        } else {
          
          this.alert.warn('Tên tài khoản đã tồn tại');
          this.isSaving = false;
        }
      })
    }
  }
  
  
  private onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
    this.alert.success('Thêm thành công');  }

  private onSaveError(response: HttpErrorResponse): void {
    this.isSaving = false;
    if (response.status !== 200) {
      this.alert.error('Thêm không thành công');    }
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }
  
}



