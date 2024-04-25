import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { Storage } from '../Storage.model';
import { StorageService } from '../Storage.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const Template = {} as Storage;
@Component({
    selector: '',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class newStorageComponent {
    success = false;
    error = false;
    isSaving = false;
    currentPath: string


    StorageForm = new FormGroup({
        id: new FormControl(Template.id),
        dungLuong: new FormControl(Template.dungLuong, { validators: [Validators.required] }),
        trangThai: new FormControl(Template.trangThai = true)
    });

    constructor(
        private StorageService: StorageService,
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
        const obj = this.StorageForm.getRawValue();
        console.log(obj)
        this.StorageService.create(obj).subscribe({
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
