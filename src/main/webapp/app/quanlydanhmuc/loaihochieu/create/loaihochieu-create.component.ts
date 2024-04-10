import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { IPassport } from '../loaihochieu.model';
import { PassportService } from '../loaihochieu.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const userTemplate = {} as IPassport;
@Component({
  selector: 'jhi-passport',
  templateUrl: './loaihochieu-create.component.html',
  styleUrls: ['./loaihochieu-create.component.scss']
})
export class newPassportComponent {
    success = false;
    errorPassportExists = false;
  error = false;
  isSaving= false;
  currentPath: string

    
PassportForm = new FormGroup({
    id: new FormControl(userTemplate.id),
    loaiHoChieu: new FormControl(userTemplate.loaiHoChieu, {validators: [Validators.required]}),
    moTa: new FormControl(userTemplate.moTa),
  tinhTrang: new FormControl(userTemplate.tinhTrang = true),
  updatedBy: new FormControl(userTemplate.updatedBy),
    createdBy: new FormControl(userTemplate.createdBy)
  });

  constructor(
    private PassportService: PassportService,
    private alert: AlertServiceCheck,
    private router: Router,
    private navbarService: NavBarService

  ) { }
  
  ngOnInit(): void {
    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Thêm Mới')
    // this.userService.authorities().subscribe(authorities => (this.authorities = authorities));
    
  }

  previousState(): void {
    window.history.back();
  }
  createPassport(): void {
  this.isSaving = true;
  const passport = this.PassportForm.getRawValue()
   
        this.PassportService.create(passport).subscribe({
          next: () => this.onSaveSuccess(),
          error: response => this.processError(response)
        });
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
    this.alert.success('Thêm thành công');  
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === "LOGIN_ALREADY_USED_TYPE") {
      this.errorPassportExists = true;
    } else {
      this.error = true;
    }
  }

  
}
