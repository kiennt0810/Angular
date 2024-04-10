import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser, User } from '../HTNhom.model';
import { HTNhomService } from '../HTNhom.service';
import { AlertService } from 'app/core/util/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const userTemplate = {} as IUser;


@Component({
  selector: 'jhi-HTNhom-create',
  templateUrl: './HTNhom-create.component.html',
  styleUrls: ['../../quantrihethong.component.scss'],
})
export class HTNhomCreateComponent implements OnInit {
  user: User | null = null;
  authorities: string[] = [];
  isSaving = false;
  currentPath: string

  editForm = new FormGroup({
    id: new FormControl(userTemplate.id = 0),
    maNhom: new FormControl(userTemplate.maNhom, { validators: [Validators.required] }),
    ten: new FormControl(userTemplate.ten, { validators: [Validators.required] }),
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
    private userService: HTNhomService,
    private route: ActivatedRoute,
    private alert: AlertServiceCheck,
    private router: Router,
    private navbarService: NavBarService
  ) {
  }

  

  ngOnInit(): void {
    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Thêm Mới')
    // this.userService.authorities().subscribe(authorities => (this.authorities = authorities));
    
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const user = this.editForm.getRawValue();
    user.maNhom = user.maNhom.trim();
    user.ten = user.ten.trim();
    this.userService.getTen(user.maNhom).subscribe((res: any) => {
      if (res == null) {
        this.userService.create(user).subscribe({
          next: () => this.onSaveSuccess(),
          error: response => this.onSaveError(response),
        });
      } else {
        this.alert.warn('Nhóm đã tồn tại');
        this.isSaving = false;
      }
    })
      

  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.alert.success('Thêm thành công');
    this.previousState();
  }

  private onSaveError(response: HttpErrorResponse): void {
    this.isSaving = false;
    if (response.status !== 200) {
      this.alert.error('Thêm không thành công');
    }
  
  }


}
