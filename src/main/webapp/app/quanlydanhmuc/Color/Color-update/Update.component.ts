import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ColorService } from '../Color.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';


@Component({
    selector: 'jhi-update',
    templateUrl: './Update.component.html',
    styleUrls: ['./Update.component.scss']
})
export class ColorUpdateComponent implements OnInit {
    isSaving = false;
    currentPath: string


    editForm = new FormGroup({
        id: new FormControl(),
        maMau: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,

            ],
        }),
        trangThai: new FormControl()
    });

    constructor(
        private Service: ColorService,
        private route: ActivatedRoute,
        private router: Router,
        private alert: AlertServiceCheck,
        private navbarService: NavBarService
    ) { }

    ngOnInit(): void {
        this.currentPath = this.router.url;
        this.navbarService.getSubPath(this.currentPath, 'Sửa')
        const id = this.route.snapshot.params.colorId;
        this.Service.getCurrentData(id).subscribe((result) => {
            this.editForm = new FormGroup({
                id: new FormControl(result['id'],),
                maMau: new FormControl(result['maMau'], {
                    validators: [Validators.required]
                }),
                trangThai: new FormControl(result['trangThai'])
            })
        });
    }

    previousState(): void {
        window.history.back();
    }

    save(): void {
        this.isSaving = true;
        const color = this.editForm.getRawValue();
        if (color.id !== null) {
            this.Service.update(color).subscribe({
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
