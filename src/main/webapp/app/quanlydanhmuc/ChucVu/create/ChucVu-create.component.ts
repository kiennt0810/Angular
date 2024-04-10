import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { ChucVu } from '../ChucVu.model';
import { ChucVuService } from '../ChucVu.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const Template = {} as ChucVu;
@Component({
    selector: '',
    templateUrl: './ChucVu-create.component.html',
    styleUrls: ['./ChucVu-create.component.scss']
})
export class newChucVuComponent {
    success = false;
    error = false;
    isSaving = false;
    currentPath: string


    ChucVuForm = new FormGroup({
        id: new FormControl(Template.id),
        chucVu: new FormControl(Template.chucVu, { validators: [Validators.required] }),
        coQuan: new FormControl(Template.coQuan),
        tinhTrang: new FormControl(Template.tinhTrang = true),
        updatedBy: new FormControl(Template.updatedBy),
        createdBy: new FormControl(Template.createdBy)
    });

    constructor(
        private ChucVuService: ChucVuService,
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
    create(): void {
        this.isSaving = true;
        const chucVu = this.ChucVuForm.getRawValue()

        this.ChucVuService.create(chucVu).subscribe({
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
        this.alert.error('Thêm mới không thành công');
    }


}
