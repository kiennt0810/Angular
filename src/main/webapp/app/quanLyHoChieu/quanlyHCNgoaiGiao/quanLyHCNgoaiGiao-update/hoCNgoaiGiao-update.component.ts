import { ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { HoChieuNgoaiGiao } from '../hoCNgoaiGiao.model';
import { HChieuNGService } from '../service/hoCNgoaiGiao.service';
import { IFileUpload } from '../quanLyHCNgoaiGiao-new/hoCNgoaiGiao-new.component';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadHC } from '../file-HC.model';
import * as fileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { Passport } from 'app/quanlydanhmuc/loaihochieu/loaihochieu.model';
import { PassportService } from 'app/quanlydanhmuc/loaihochieu/loaihochieu.service';
import { SessionStorageService } from 'ngx-webstorage';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const HCNGTemplate = {} as HoChieuNgoaiGiao;
const fileTemplate = {} as FileUploadHC;
const listOldFileDownload = new FormArray([]);
declare var $: any;

const editHCNG: HoChieuNgoaiGiao = {
} as HoChieuNgoaiGiao;

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date
      ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year
      : '';
  }
}

@Component({
  selector: 'jhi-editPassport-mgmt-update',
  templateUrl: './hoCNgoaiGiao-update.component.html',
  styleUrls: ['./hoCNG-update.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class HCNgoaiGiaoUpdateComponent implements OnInit {
  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = "";
  imageUrlOld: any;
  editFile: boolean = true;
  removeUpload: boolean = false;

  success = false;
  errorPassportExists = false;
  error = false;
  hoChieuNG: HoChieuNgoaiGiao | null = null;
  isSaving = false;
  isuploadDocument: boolean;
  fileToUpload: File = null;
  fileUploaded: IFileUpload = null;
  lstUploadedFiles: IFileUpload[] = [];
  listOldFile: FileUploadHC | null = null;
  lstFile: [];
  totalFileSize: number;
  ImgName;
  listNewFile: File[] = [];
  selectedFile = null;
  passports: Passport[] | null = null;

  showWarning1 = false;
  showWarning2 = false;
  showWarning3 = false;
  currentPath: string;
  oldImgId: number;
  strLsFileDelete: string;
  countDele: number = 0;

  editForm = new FormGroup({
    soHC: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    hoTen: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(254)] }),
    gioiTinh: new FormControl(''),
    cmndSo: new FormControl(''),
    ngaySinh: new FormControl(''),
    noiSinh: new FormControl(''),
    chucVu: new FormControl(''),
    coQuan: new FormControl(''),
    loaiHC: new FormControl(''),
    cmndNgayCap: new FormControl(''),
    cmndNgayHL: new FormControl(''),
    cmndNoiCap: new FormControl(''),
    listHC: listOldFileDownload,
  });

  listfileUp = new FormGroup({
    id: new FormControl(fileTemplate.id),
    fileName: new FormControl(fileTemplate.fileName),
    type: new FormControl(fileTemplate.type),
  })

  constructor(private Service: HChieuNGService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef,
    //private toast: AlertService,
    private sanitizer: DomSanitizer,
    private passportService: PassportService,
    private alert: AlertServiceCheck,
    private sessionStorageService: SessionStorageService,
    private navbarService: NavBarService
  ) {}

  ngOnInit(): void {
    this.totalFileSize = 0;
    this.loadAllPassport();
    this.listNewFile = [];
    const soHC = this.route.snapshot.params.soHC;
    this.Service.getCurrentGNHC(soHC).subscribe((result) => {
      this.hoChieuNG = result;
      this.listOldFile = result.listHCFileVM;
      this.editForm = new FormGroup({
        soHC: new FormControl(result['soHC']),
        hoTen: new FormControl(result['hoTen']),
        gioiTinh: new FormControl(result['gioiTinh']),
        cmndSo: new FormControl(result['cmndSo'] == 'null' ? "" : result['cmndSo']),
        ngaySinh: new FormControl(result['ngaySinh']),
        noiSinh: new FormControl(result['noiSinh'] == 'null' ? "" : result['noiSinh']),
        chucVu: new FormControl(result['chucVu'] == 'null' ? "" : result['chucVu']),
        coQuan: new FormControl(result['coQuan'] == 'null' ? "" : result['coQuan']),
        loaiHC: new FormControl(result['loaiHC']),
        cmndNgayCap: new FormControl(result['cmndNgayCap']),
        cmndNgayHL: new FormControl(result['cmndNgayHL']),
        cmndNoiCap: new FormControl(result['cmndNoiCap'] == 'null' ? "" : result['cmndNoiCap']),
        listHC: listOldFileDownload,
      })
      listOldFileDownload.clear();
      for (let index = 0; index < this.hoChieuNG.listHCFileVM.length; index++) {
        this.listfileUp = new FormGroup({
          id: new FormControl(this.hoChieuNG.listHCFileVM[index].id),
          fileName: new FormControl(this.hoChieuNG.listHCFileVM[index].fileName),
          type: new FormControl(this.hoChieuNG.listHCFileVM[index].type),
        })
        listOldFileDownload.push(this.listfileUp);
      }

      for (let i = 0; i < result.listHCFileVM.length; i++) {
        if (this.listOldFile[i].type == 0) {
          this.oldImgId = this.listOldFile[i].id;
          this.downloadImg(this.listOldFile[i].id);
        }
      }

    });

    this.currentPath = this.router.url;
    console.log(this.currentPath)
    this.navbarService.getSubPath(this.currentPath, 'Sửa');
  }

  isInvalidDate1(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.showWarning1 = true
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY!');
      event.target.value = null
    } else {
      this.showWarning1 = false
    }
  }
  isInvalidDate2(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.showWarning2 = true
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY!');
      event.target.value = null
    } else {
      this.showWarning2 = false
    }
  }
  isInvalidDate3(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.showWarning3 = true
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY!');
      event.target.value = null
    } else {
      this.showWarning3 = false
    }
  }

  get listFileControls() {
    // a getter!
    return (<FormArray>this.editForm.get('listHC')).controls;
  }

  downloadFile(id: number, name: string) {
    this.Service.downloadFile(id).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/json; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, name);
    }), (error: any) => console.log('Error downloading the file');
  }


  downloadImg(id: number) {
    this.Service.downloadFile(id).subscribe((data: Blob) => {
      let objectURL = URL.createObjectURL(data);
      this.imageUrlOld = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }), (error: any) => console.log('Error downloading the file');
  }

  previousState(): void {
    window.history.back();
  }

  
  deleteRowFile(index: number) {
    var delBtn = confirm(" Bạn có muốn xóa không ?");
    if (delBtn == true) {
      var arrayControl = this.editForm.get('listHC') as FormArray;
      var id = arrayControl.at(index).value.id;
      (<FormArray>this.editForm.get('listHC')).removeAt(index);
      if (this.countDele == 0) {
        this.strLsFileDelete = String(id);
        this.countDele = 1;
      } else {
        this.strLsFileDelete = this.strLsFileDelete + ',' + String(id);
      }
    }
  }

  compareDate(d1: string) {
    let [day, month, year] = d1.split('/');
    const dateCompare = new Date(+year, +month - 1, +day).getTime();
    let date2 = new Date().getTime();
    if (dateCompare < date2) {
      return true;
    } else if (dateCompare > date2) {
      return false;
    } else {
      console.log(`Both dates are equal`);
    }
  };

  compareDateHL(d1: string, d2: string) {
    let [day, month, year] = d1.split('/');
    const ngayCap = new Date(+year, +month - 1, +day).getTime();
    let [day2, month2, year2] = d2.split('/');
    const ngayHl = new Date(+year2, +month2 - 1, +day2).getTime();
    if (ngayCap < ngayHl) {
      return true;
    } else if (ngayCap > ngayHl) {
      return false;
    } else {
      console.log(`Both dates are equal`);
    }
  };

  nameValidator(key: string) {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (key && nameRegexp.test(key)) {
      return true;
    } else {
      return false;
    }
  }

  save() {
    const formData = new FormData();
    var idLoaiHC: number;
    const updateForm = this.editForm.value;
    updateForm.cmndNgayCap = $('#dateNgayCap').first().val();
    updateForm.cmndNgayHL = $('#dateNgayHL').first().val();
    updateForm.ngaySinh = $('#dateNgaySinh').first().val();
    let userName: string = this.sessionStorageService.retrieve('userName');

    if (String($('#gioiTinh').val()) == 'null') {
      updateForm.gioiTinh = '';
    }

    for (let i = 0; i <= this.passports.length; i++) {
      if (this.passports[i]?.loaiHoChieu.trim() === updateForm.loaiHC.trim()) {
        idLoaiHC = this.passports[i].id;
      }
    }

    if (($('#dateNgaySinh').val() != '') && (!this.compareDate(updateForm.ngaySinh))) {
      this.alert.warn('Ngày sinh không được lớn hơn ngày hiện tại!');
      $('#dateNgaySinh').focus();
    } else if (updateForm.cmndNgayCap == null || updateForm.cmndNgayCap == '' || updateForm.cmndNgayCap == undefined) {
      this.alert.warn('Ngày cấp không được để trống');
      $('#dateNgayCap').focus();
    } else if (!this.compareDate(updateForm.cmndNgayCap)) {
      this.alert.warn('Ngày cấp không được lớn hơn ngày hiện tại!');
      $('#dateNgayCap').focus();
    } else if (updateForm.cmndNgayHL == null || updateForm.cmndNgayHL == '' || updateForm.cmndNgayHL == undefined) {
      this.alert.warn('Ngày có giá trị đến không được để trống!');
      $('#dateNgayHL').focus();
    } else if (!this.compareDateHL(updateForm.cmndNgayCap, updateForm.cmndNgayHL)) {
      this.alert.warn('Ngày cấp không được lớn hơn ngày Có giá trị đến!');
      $('#dateNgayCap').focus();
    } else {
      if ($('#noiSinh').val() != '') {
        updateForm.noiSinh = updateForm.noiSinh.trim();
      }
      if ($('#cmndSo').val() != '') {
        updateForm.cmndSo = updateForm.cmndSo.trim();
      }
      if ($('#chucVu').val() != '') {
        updateForm.chucVu = updateForm.chucVu.trim();
      }
      if ($('#coQuan').val() != '') {
        updateForm.coQuan = updateForm.coQuan.trim();
      }
      if ($('#cmndNoiCap').val() != '') {
        updateForm.cmndNoiCap = updateForm.cmndNoiCap.trim();
      }
      formData.append('loaiHC', updateForm.loaiHC);
      formData.append('idLoaiHC', String(idLoaiHC));
      formData.append('soHC', updateForm.soHC);
      formData.append('hoten', updateForm.hoTen.trim());
      formData.append('gioiTinh', updateForm.gioiTinh);
      formData.append('ngaySinh', updateForm.ngaySinh);
      formData.append('noiSinh', updateForm.noiSinh);
      formData.append('cmndSo', updateForm.cmndSo);
      formData.append('cmndNgayCap', updateForm.cmndNgayCap);
      formData.append('cmndNgayHL', updateForm.cmndNgayHL);
      formData.append('cmndNoiCap', updateForm.cmndNoiCap);
      formData.append('chucVu', updateForm.chucVu);
      formData.append('coQuan', updateForm.coQuan);
      formData.append('fileHoChieu', this.ImgName);
      formData.append('strLsFileDelete', this.strLsFileDelete);
      formData.append('updatedBy', userName);
      this.listNewFile.push(HCNGTemplate.imgFile);
      for (let i = 0; i < this.listNewFile.length; i++) {
        formData.append('listFile', this.listNewFile[i]);
      }
      if (updateForm.soHC !== null) {
        this.Service.update(formData).subscribe({ next: (response) => this.onSaveSuccess(response), error: response => this.processError(response) });
      }
    }
  }


  private onSaveSuccess(response): void {
    console.log(response);
    if (Number(response.status) != 200) {
      this.alert.error('Cập nhật không thành công');
      //this.toast.addAlert({ message: 'Cập nhật không thành công', type: 'danger', toast: true });
    } else {
      this.router.navigate(['/HoChieu/quanlyHCNgoaiGiao']);
      this.alert.success('Cập nhật hộ chiếu thành công');
      //this.toast.addAlert({ message: 'Cập nhật hộ chiếu thành công', type: 'success', toast: true });

    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === "LOGIN_ALREADY_USED_TYPE") {
      this.errorPassportExists = true;
    } else {
      this.error = true;
    }
  }

  uploadIMG(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    HCNGTemplate.imgFile = event.target.files[0];
    this.ImgName = HCNGTemplate.imgFile.name;
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(HCNGTemplate.imgFile);
      console.log(HCNGTemplate.imgFile);
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.editFile = false;
        this.removeUpload = true;
      }
      this.cd.markForCheck();
    }
    if (this.countDele == 0) {
      this.strLsFileDelete = String(this.oldImgId);
      this.countDele = 1;
    } else {
      this.strLsFileDelete = this.strLsFileDelete + ',' + String(this.oldImgId);
    }
  }


  handleFileInput = async (event) => {
    this.selectedFile = event.target.files;
    // console.log('upload' + this.selectedFile);
    for (let i = 0; i < this.selectedFile.length; i++) {
      this.listNewFile.push(this.selectedFile[i]);
    }
    // console.log('listFile' + this.fileList);
    HCNGTemplate.fileHoSo = event.target.files;
    this.isuploadDocument = false;
    if (HCNGTemplate.fileHoSo.length > 0) {
      for (let i = 0; i < HCNGTemplate.fileHoSo.length; i++) {
        this.fileToUpload = HCNGTemplate.fileHoSo.item(i);
        this.totalFileSize = this.totalFileSize + this.fileToUpload.size;
        if (this.totalFileSize <= 104857600) {
          this.fileUploaded = {
            RequestID: '',
            AttachmentFlag: true,
            FormType: 'MRF',
            AttachmentName: this.fileToUpload.name,
            AttachmentContent: await this.readUploadedFileAsDataUrl(HCNGTemplate.fileHoSo.item(i))
          };
          this.lstUploadedFiles.push(this.fileUploaded);
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

  remove(filename: string, i: number): void {
    this.listNewFile.splice(i,1);
    $('#inputGroupFile').val(null);
    HCNGTemplate.fileHoSo = [].slice.call(HCNGTemplate.fileHoSo).filter(e => e.name !== filename);
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

  loadAllPassport(): void {
    this.passportService.getLstPP().subscribe({
      next: (res: HttpResponse<Passport[]>) => {
        this.onSuccessLstPassport(res.body);
      }
    });
  }
  private onSuccessLstPassport(passport: Passport[] | null): void {
    this.passports = passport;
    // for (let i = 0; i <= this.passports.length; i++) {
    //   if (this.passports[i]?.tinhTrang == false) {
    //     const index: number = this.passports.indexOf(this.passports[i]);
    //     i--;
    //     this.passports.splice(index, 1);
    //   }
    // }
  }
}
