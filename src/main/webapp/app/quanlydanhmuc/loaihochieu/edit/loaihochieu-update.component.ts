import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IPassport } from '../loaihochieu.model';
import { PassportService } from '../loaihochieu.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const passportTemplate = {} as IPassport;

const editPassport: IPassport = {
} as IPassport;

@Component({
  selector: 'jhi-editPassport-mgmt-update',
  templateUrl: './loaihochieu-update.component.html',
  styleUrls: ['./loaihochieu-update.component.scss']
})
export class PassportUpdateComponent implements OnInit {
  isSaving = false;
  currentPath: string


  editForm = new FormGroup({
    id: new FormControl(),
    loaiHoChieu: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        
      ],
    }),
    moTa: new FormControl('', {
       
      }),
    tinhTrang: new FormControl(),
    updatedBy: new FormControl(),
    createdBy: new FormControl()
  });

  constructor(
    private Service: PassportService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private alert: AlertServiceCheck,
    private navbarService: NavBarService
  ) { }

  ngOnInit(): void {
    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Sửa')
    console.log(this.route.snapshot.params.passportId);
    const id = this.route.snapshot.params.passportId;
    this.Service.getCurrentData(id).subscribe((result) => { 
      this.editForm = new FormGroup({
        id: new FormControl(result['id'], ),
        loaiHoChieu: new FormControl(result['loaiHoChieu'], {
          validators: [Validators.required]
        }),
        moTa: new FormControl(result['moTa'], {
          
        }),
        tinhTrang: new FormControl(result['tinhTrang']),
        updatedBy: new FormControl(),
        createdBy: new FormControl()
      })
    });

    

    // this.route.data.subscribe(({ passport }) => {
    //   if (passport) {
    //     this.editForm.reset(passport);
    //   } else {
    //     this.editForm.reset(newPassport);
    //   }
    // });
    //this.Service.authorities().subscribe(authorities => (this.authorities = authorities));
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const passport = this.editForm.getRawValue();
    if (passport.id !== null) {
      this.Service.update(passport).subscribe({
        next: () => this.onSaveSuccess(),
        error:response => this.onSaveError(response),
      });
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
