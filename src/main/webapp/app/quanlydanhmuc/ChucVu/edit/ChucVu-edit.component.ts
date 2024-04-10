import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChucVu } from '../ChucVu.model';
import { ChucVuService } from '../ChucVu.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';


@Component({
    selector: 'jhi-editPassport-mgmt-update',
    templateUrl: './ChucVu-edit.component.html',
    styleUrls: ['./ChucVu-edit.component.scss']
})
export class ChucVuUpdateComponent implements OnInit {
    isSaving = false;
    currentPath: string


    editForm = new FormGroup({
        id: new FormControl(),
        chucVu: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,

            ],
        }),
        coQuan: new FormControl('', {

        }),
        tinhTrang: new FormControl()
    });

    constructor(
        private Service: ChucVuService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private alert: AlertServiceCheck,
        private navbarService: NavBarService
    ) { }

    ngOnInit(): void {
        this.currentPath = this.router.url;
        this.navbarService.getSubPath(this.currentPath, 'Sửa')
        const id = this.route.snapshot.params.chucVuId;
        this.Service.getCurrentData(id).subscribe((result) => {
            this.editForm = new FormGroup({
                id: new FormControl(result['id'],),
                chucVu: new FormControl(result['chucVu'], {
                    validators: [Validators.required]
                }),
                coQuan: new FormControl(result['coQuan'], {

                }),
                tinhTrang: new FormControl(result['tinhTrang'])
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
        const chucvu = this.editForm.getRawValue();
        if (chucvu.id !== null) {
            this.Service.update(chucvu).subscribe({
                next: () => this.onSaveSuccess(),
                error: response => this.onSaveError(response),
            });
        }
    }

    private onSaveSuccess(): void {
        this.isSaving = false;
        this.previousState();
        this.alert.success('Sửa thành công');
    }

    private onSaveError(response: HttpErrorResponse): void {
        this.isSaving = false;
        if (response.status !== 200) {
            this.alert.error('Sửa không thành công');
        }
    }
}
