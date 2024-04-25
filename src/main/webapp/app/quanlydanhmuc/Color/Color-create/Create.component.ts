import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { Color } from '../Color.model';
import { ColorService } from '../Color.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const Template = {} as Color;
@Component({
    selector: '',
    templateUrl: './Create.component.html',
    styleUrls: ['./Create.component.scss']
})
export class newColorComponent {
    success = false;
    error = false;
    isSaving = false;
    currentPath: string


    ColorForm = new FormGroup({
        id: new FormControl(Template.id),
        maMau: new FormControl(Template.maMau, { validators: [Validators.required] }),
        trangThai: new FormControl(Template.trangThai = true)
    });

    constructor(
        private ColorService: ColorService,
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
        const color = this.ColorForm.getRawValue()

        this.ColorService.create(color).subscribe({
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
