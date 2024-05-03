import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { AdFile } from '../adFile.model';
import { AdFileService } from '../adFile.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
declare var $: any;
const Template = {} as AdFile;

export interface IFileUpload {
    RequestID: string;
    AttachmentName: string;
    AttachmentContent: any;
    FormType: string;
    AttachmentFlag: boolean;
}

@Component({
    selector: '',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})


export class newAdFileComponent {
    success = false;
    error = false;
    isSaving = false;
    currentPath: string;
    lstUploadedFiles: IFileUpload[] = [];
    selectedFile = null;
    isuploadDocument: boolean;
    fileToUpload: File = null;
    checkNameFile = true;
    nameFile: string[] = [];
    totalFileSize: number;
    fileUploaded: IFileUpload = null;
    fileList: File[] = [];

    urlList: string[] = [];
    checkUpload = false;

    AdfileForm = new FormGroup({
        id: new FormControl(Template.id),
        fileImg: new FormControl(Template.fileImg, { validators: [Validators.required] }),
        listAdFileVM: new FormControl(Template.listAdFileVM)
    });

    constructor(
        private Service: AdFileService,
        private alert: AlertServiceCheck,
        private router: Router,
        private navbarService: NavBarService

    ) { }

    ngOnInit(): void {
        this.totalFileSize = 0;
        this.fileList = [];
        this.currentPath = this.router.url;
        this.navbarService.getSubPath(this.currentPath, 'Thêm Mới');
    }

    previousState(): void {
        window.history.back();
    }

    onRemove(event) {
        this.fileList.splice(this.fileList.indexOf(event), 1);
    }

    create(): void {
        this.isSaving = true;
        const formData = new FormData();
        if (this.urlList.length > 0) {
            for (let i = 0; i < this.urlList.length; i++) {
                formData.append('listFile', this.urlList[i]);     
            }
            this.Service.create(formData).subscribe({ next: () => this.onSaveSuccess(), error: () => this.processError() });
        }
    }

    upLoad(): void {
        this.checkUpload = false;
        for (let i = 0; i < this.fileList.length; i++) {
            this.readUploadedFileAsDataUrl(this.fileList[i]).then(fileContents => {
                this.Service.upload2imgur(fileContents).then((ret: any) => {
                    ret = JSON.parse(ret.target.response);
                    this.urlList.push((ret.data.link).toString());
                    this.onRemove(this.fileList[i]);
                    if (i = this.fileList.length) {
                        this.alert.success('Upload ảnh thành công');
                        this.checkUpload = true;
                    }
                })
            });
        }
    }

    private onSaveSuccess(): void {
        this.isSaving = false;
        this.previousState();
        this.alert.success('Thêm thành công');

    }

    private processError(): void {
        this.alert.error('Thêm mới không thành công');
    }

    handleFileInput = async (event) => {
        this.selectedFile = event.target.files;

        Template.fileImg = event.target.files;
        this.isuploadDocument = false;
        if (Template.fileImg.length > 0) {
            for (let i = 0; i < Template.fileImg.length; i++) {
                this.fileToUpload = Template.fileImg.item(i);
                for (let j = 0; j < this.nameFile.length; j++) {
                    if (this.fileToUpload.name == this.nameFile[j]) {
                        this.checkNameFile = false;
                        break;
                    }
                }
                if (this.checkNameFile) {
                    this.totalFileSize = this.totalFileSize + this.fileToUpload.size;
                    if (this.totalFileSize <= 104857600) {
                        this.fileUploaded = {
                            RequestID: '',
                            AttachmentFlag: true,
                            FormType: 'MRF',
                            AttachmentName: this.fileToUpload.name,
                            AttachmentContent: await this.readUploadedFileAsDataUrl(Template.fileImg.item(i))
                        };
                        this.lstUploadedFiles.push(this.fileUploaded);
                        this.fileList.push(this.selectedFile[i]);
                        this.isuploadDocument = true;
                    } else {
                        this.isuploadDocument = false;
                        this.alert.error('Tải file không quá 100 MB');
                    }
                }
            }
        }
    }

    remove(filename: string, i: number): void {
        this.fileList.splice(i, 1);
        $('#inputGroupFile').val(null);
        Template.fileImg = [].slice.call(Template.fileImg).filter(e => e.name !== filename);
        this.lstUploadedFiles = this.lstUploadedFiles.filter(e => e.AttachmentName !== filename);
        this.totalFileSize = 0;
        this.lstUploadedFiles.forEach(fl => {
            this.totalFileSize = this.totalFileSize + fl.AttachmentContent.length;
        });
    }

    readUploadedFileAsDataUrl = (inputFile) => {
        const temporaryFileReader = new FileReader();
        return new Promise((resolve, reject) => {
            temporaryFileReader.onerror = () => {
                temporaryFileReader.abort();
                reject(this.alert.error('Không thể tải file'));
            };
            temporaryFileReader.onload = () => {
                resolve(temporaryFileReader.result);
            };
            temporaryFileReader.readAsDataURL(inputFile);
        });
    }


}
