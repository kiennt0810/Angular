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
        // this.userService.authorities().subscribe(authorities => (this.authorities = authorities));

    }

    previousState(): void {
        window.history.back();
    }
    create(): void {
        this.isSaving = true;
        const formData = new FormData();
        const createForm = this.AdfileForm.value;
        for (let i = 0; i < this.fileList.length; i++) {
            formData.append('listFile', this.fileList[i]);
          }
          console.log(formData.getAll('listFile'));
          this.Service.create(formData).subscribe({ next: (response) => this.onSaveSuccess(), error: response => this.processError(response) });
    }

    private onSaveSuccess(): void {
        this.isSaving = false;
        this.previousState();
        this.alert.success('Thêm thành công');
        
    }

    private processError(response: HttpErrorResponse): void {
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
                console.log('lstUploadedFiles' + this.lstUploadedFiles);
                this.isuploadDocument = true;
              } else {
                this.isuploadDocument = false;
                // this.toastrService.error('Combined file size must not exceed 4 MB', 'Error!');
                this.alert.error('Tải file không quá 100 MB');
                //this.toast.addAlert({ message: 'Tải file không quá 100 MB', type: 'danger', toast: true })
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
