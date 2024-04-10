import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IUser, User } from '../quocgiavavunglanhtho.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { AlertService } from 'app/core/util/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const userTemplate = {} as IUser;
const newUser: IUser = {} as IUser;

@Component({
  selector: 'jhi-quocgiavavunglanhtho-create',
  templateUrl: './quocgiavavunglanhtho-create.component.html',
  styleUrls: ['./quocgiavavunglanhtho-create.component.scss', '../../quanlydanhmuc.component.scss']
})
export class QuocgiavavunglanhthoCreateComponent implements OnInit {
  user: User | null = null;
  authorities: string[] = [];
  isSaving = false;
  currentPath: string


  editForm = new FormGroup({
    maQG: new FormControl(userTemplate.maQG, { validators: [Validators.required,] }),
    ten: new FormControl(userTemplate.ten, { validators: [Validators.required,] }),
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
    private userService: QuocgiavavunglanhthoService,
    private route: ActivatedRoute,
    private alert: AlertServiceCheck,
    private router: Router,
    private navbarService: NavBarService

  ) { }

  ngOnInit(): void {
    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Thêm Mới')
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const user = this.editForm.getRawValue();
    this.userService.find(user.maQG).subscribe((res: any) => {
      if (res == null) {
        this.userService.create(user).subscribe({
          next: () => this.onSaveSuccess(),
          error:response => this.onSaveError(response),
        })
      } else {
        this.alert.warn('Quốc gia đã tồn tại');
        this.isSaving = false
      }
    })
    
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
    this.alert.success('Thêm thành công');  
  }

  private onSaveError(response: HttpErrorResponse): void {
    this.isSaving = false;
    if (response.status !== 200) {
      this.alert.error('Thêm không thành công');
    }
  }
}
