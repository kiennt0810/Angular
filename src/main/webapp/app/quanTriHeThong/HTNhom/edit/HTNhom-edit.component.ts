import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser, User } from '../HTNhom.model';
import { HTNhomService } from '../HTNhom.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'app/core/util/alert.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const userTemplate = {} as IUser;

@Component({
  selector: 'jhi-HTNhom-edit',
  templateUrl: './HTNhom-edit.component.html',
  styleUrls: [ '../../quantrihethong.component.scss']
})
export class HTNhomEditComponent implements OnInit {
  user: User | null = null;
  authorities: string[] = [];
  isSaving = false;
  currentPath: string


  editForm = new FormGroup({
    id: new FormControl(userTemplate.id),
    maNhom: new FormControl(userTemplate.maNhom, { validators: [Validators.required,Validators.maxLength(50)] }),
    ten: new FormControl(userTemplate.ten, { validators: [Validators.required,Validators.maxLength(50)] }),
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
    private userService: HTNhomService,
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
        maNhom: new FormControl(result['maNhom']),
        ten: new FormControl(result['ten'],  { validators: [Validators.required,Validators.maxLength(50)] }),
        tinhTrang: new FormControl(result['tinhTrang']),
        createdBy: new FormControl(result['CreatedBy']),
        updatedBy: new FormControl(result['UpdatedBy']),
        createdDate: new FormControl(result['CreatedDate']),
        updatedDate: new FormControl(result['UpdatedDate']),
      })
    })
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const user = this.editForm.getRawValue();
  
      this.userService.update(user).subscribe({
        next: () => this.onSaveSuccess(),
        error:response => this.onSaveError(response),
      });
    
  }

  private onSaveSuccess(): void {
    this.isSaving = false;
    this.alert.success('Sửa thành công');
    this.previousState();
  }

  private onSaveError(response: HttpErrorResponse): void {
    this.isSaving = false;
    if (response.status !== 200) {
      this.alert.error('Sửa không thành công');    }
  }
}
