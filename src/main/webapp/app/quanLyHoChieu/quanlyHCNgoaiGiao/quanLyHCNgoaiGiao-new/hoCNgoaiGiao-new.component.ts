import { Component, ElementRef, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { NgbCalendar, NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HChieuNGService } from '../service/hoCNgoaiGiao.service';
import { AlertService } from 'app/core/util/alert.service';
import { Router } from '@angular/router';
import { HoChieuNgoaiGiao } from '../hoCNgoaiGiao.model';

import moment from 'moment';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { Passport } from 'app/quanlydanhmuc/loaihochieu/loaihochieu.model';
import { PassportService } from 'app/quanlydanhmuc/loaihochieu/loaihochieu.service';
import { SessionStorageService } from 'ngx-webstorage';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { ViewCheckComponent } from '../view-check/view-check.component';
//import * as $ from 'jquery';

const HCNGTemplate = {} as HoChieuNgoaiGiao;

declare var $: any;

export interface IFileUpload {
  RequestID: string;
  AttachmentName: string;
  AttachmentContent: any;
  FormType: string;
  AttachmentFlag: boolean;
}

export function minYearValidator(year: number) {
  const validationString = moment(year).format("YYYY");
  if (validationString === "Invalid date" || Number(validationString) < year)
    return { ValidateDate: { value: true } }
}

@Component({
  selector: 'jhi-hoCNgoaiGiao',
  templateUrl: './hoCNgoaiGiao-new.component.html',
  styleUrls: ['./hoCNG-new.component.scss']

})


export class newHCNgoaiGiaoComponent implements OnInit {
  hoChieuNgoaiGiao: HoChieuNgoaiGiao | null = null;
  success = false;
  isSaving = false;
  errorPassportExists = false;
  error = false;
  isuploadDocument: boolean;
  fileToUpload: File = null;
  fileUploaded: IFileUpload = null;
  lstUploadedFiles: IFileUpload[] = [];
  fileList: File[] = [];
  totalFileSize: number;
  selectedFile = null;
  ImgName;
  passports: Passport[] | null = null;
  checkDouble = false;
  currentAccount: Account | null = null;

  showWarning1 = false;
  showWarning2 = false;
  showWarning3 = false;
  checkKyTu = false;
  checkNull = false;
  currentPath: string;

  HCNgoaiGiaoForm = new FormGroup({

    loaiHC: new FormControl(HCNGTemplate.loaiHC),
    soHC: new FormControl(HCNGTemplate.soHC),
    hoTen: new FormControl(HCNGTemplate.hoTen),
    gioiTinh: new FormControl(HCNGTemplate.gioiTinh),
    ngaySinh: new FormControl(HCNGTemplate.ngaySinh),
    noiSinh: new FormControl(HCNGTemplate.noiSinh),
    quocTich: new FormControl(HCNGTemplate.quocTich),
    cmndSo: new FormControl(HCNGTemplate.cmndSo),
    cmndNgayCap: new FormControl(HCNGTemplate.cmndNgayCap),
    cmndNgayHL: new FormControl(HCNGTemplate.cmndNgayHL),
    cmndNoiCap: new FormControl(HCNGTemplate.cmndNoiCap),
    chucVu: new FormControl(HCNGTemplate.chucVu),
    coQuan: new FormControl(HCNGTemplate.coQuan),
    imgFile: new FormControl(HCNGTemplate.imgFile),
    fileHoSo: new FormControl(HCNGTemplate.fileHoSo),
  });



  constructor(
    private HoChieuNGService: HChieuNGService,
    private alert: AlertServiceCheck,
    private router: Router,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private cd: ChangeDetectorRef,
    private passportService: PassportService,
    private accountService: AccountService,
    private sessionStorageService: SessionStorageService,
    private navbarService: NavBarService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.totalFileSize = 0;
    this.accountService.identity().subscribe(account => (this.currentAccount = account));
    this.fileList = [];
    this.loadAllPassport();
    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Thêm mới')
  }

  isInvalidDate1(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY!');
      this.showWarning1 = true
      event.target.value = null
    } else {
      this.showWarning1 = false
    }
  }
  isInvalidDate2(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY!');
      this.showWarning2 = true
      event.target.value = null
    } else {
      this.showWarning2 = false
    }
  }
  isInvalidDate3(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY!');
      this.showWarning3 = true
      event.target.value = null
    } else {
      this.showWarning3 = false
    }
  }

  CheckDoubleSoHC(event): void {
    this.checkNull = false;
    this.checkKyTu = false;
    this.checkDouble = false;
    const soHC = event.target.value;
    if (soHC == '') {
      this.checkNull = true;
    } else {
      if (this.nameValidator(String(soHC))) {
        this.checkKyTu = true;
        event.target.value = null
      } else {
        this.HoChieuNGService.getCurrentDataCheckExist(soHC).subscribe({
          next: (response) => this.processSuscessSoHc(response.body, soHC),
          error: (response) => this.processCheckSoHC(response.body, soHC)
        });
      }
    }


  }

  private processSuscessSoHc(response, soHC) {
    this.checkDouble = false;
    if (String(response.idLoaiHC) == '') {
      this.checkDouble = false;
    } else {
      //this.alert.error('Số hộ chiếu đã tồn tại');
      this.checkDouble = true;
      this.HoChieuNGService.getCurrentGNHC(soHC).subscribe((result) => {
        this.hoChieuNgoaiGiao = result;
        const modalRef = this.modalService.open(ViewCheckComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.hoChieu = this.hoChieuNgoaiGiao;
      });

      // var viewBtn = confirm('Số hộ chiếu đã tồn tại! Bạn có muốn xem thông tin chi tiết số hộ chiếu không?');
      // if(viewBtn == true) {
      //   this.router.navigate(['/HoChieu/quanlyHCNgoaiGiao/view', soHC]);
      // }

    }
  }

  private processCheckSoHC(response, soHC): void {
    this.checkDouble = false;
    if (String(response) == 'undefined') {
      this.checkDouble = false;
    } else {
      //this.alert.error('Số hộ chiếu đã tồn tại');
      //this.toast.addAlert({ message: 'Số hộ chiếu đã tồn tại', type: 'danger', toast: true });
      this.checkDouble = true;
      var viewBtn = confirm('Bạn có muốn xem thông tin chi tiết SỐ HỘ CHIẾU không?');
      if (viewBtn == true) {
        this.router.navigate(['/HoChieu/quanlyHCNgoaiGiao/view', soHC]);
      }
    }
  }

  //   private onLoadSoHC(hoChieu: HoChieuNgoaiGiao[] | null): void {
  //     this.CheckSohc = hoChieu;
  //     for (let i = 0; i < hoChieu.length; i++) {
  //         if (i != 0) {
  //             hoChieu[0].stt = 1;
  //             hoChieu[i].stt = hoChieu[i - 1].stt + 1;
  //           }
  //     }
  // }

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




  createPassport() {
    const formData = new FormData();
    const createForm = this.HCNgoaiGiaoForm.value;
    createForm.cmndNgayCap = $('#dateNgayCap').first().val();
    createForm.cmndNgayHL = $('#dateNgayHL').first().val();
    createForm.ngaySinh = $('#dateNgaySinh').first().val();
    let userName: string = this.sessionStorageService.retrieve('userName');

    if (String($('#gioiTinh').val()) == 'null') {
      createForm.gioiTinh = '';
    }

    if (this.checkDouble == true) {
      this.alert.warn('Số hộ chiếu đã tồn tại!');
      $('#soHC').focus();
    } else if (this.nameValidator(String(createForm.soHC))) {
      this.alert.warn('Số hộ chiếu không được chứa ký tự đặc biệt!');
      $('#soHC').focus();
    } else if (($('#dateNgaySinh').val() != '') && (!this.compareDate(createForm.ngaySinh))) {
      this.alert.warn('Ngày sinh không được lớn hơn ngày hiện tại!');
      $('#dateNgaySinh').focus();
    } else if (!this.compareDateHL(createForm.cmndNgayCap, createForm.cmndNgayHL)) {
      this.alert.warn('Ngày cấp không được lớn hơn ngày Có giá trị đến!');
      $('#dateNgayCap').focus();
    } else if (createForm.cmndNgayCap == null || createForm.cmndNgayCap == '' || createForm.cmndNgayCap == undefined) {
      this.alert.warn('Ngày cấp không được để trống!');
      $('#dateNgayCap').focus();
    } else if (!this.compareDate(createForm.cmndNgayCap)) {
      this.alert.warn('Ngày cấp không được lớn hơn ngày hiện tại!');
      $('#dateNgayCap').focus();
    } else if (createForm.cmndNgayHL == null || createForm.cmndNgayHL == '' || createForm.cmndNgayHL == undefined) {
      this.alert.warn('Ngày có giá trị đến không được để trống!');
      $('#dateNgayHL').focus();
    } else {
      if ($('#noiSinh').val() != '') {
        createForm.noiSinh = createForm.noiSinh.trim();
      }
      if ($('#cmndSo').val() != '') {
        createForm.cmndSo = createForm.cmndSo.trim();
      }
      if ($('#chucVu').val() != '') {
        createForm.chucVu = createForm.chucVu.trim();
      }
      if ($('#coQuan').val() != '') {
        createForm.coQuan = createForm.coQuan.trim();
      }
      if ($('#cmndNoiCap').val() != '') {
        createForm.cmndNoiCap = createForm.cmndNoiCap.trim();
      }
      formData.append('JsonLoaiHC', JSON.stringify(createForm.loaiHC));
      formData.append('soHC', createForm.soHC.trim());
      formData.append('hoten', createForm.hoTen.trim());
      formData.append('gioiTinh', createForm.gioiTinh);
      formData.append('ngaySinh', createForm.ngaySinh);
      formData.append('noiSinh', createForm.noiSinh);
      formData.append('cmndSo', createForm.cmndSo);
      formData.append('cmndNgayCap', createForm.cmndNgayCap);
      formData.append('cmndNgayHL', createForm.cmndNgayHL);
      formData.append('cmndNoiCap', createForm.cmndNoiCap);
      formData.append('chucVu', createForm.chucVu);
      formData.append('coQuan', createForm.coQuan);
      formData.append('fileHoChieu', this.ImgName);
      formData.append('createdBy', userName);
      this.fileList.push(HCNGTemplate.imgFile);
      for (let i = 0; i < this.fileList.length; i++) {
        formData.append('listFile', this.fileList[i]);
      }
      console.log(formData.getAll('listFile'));
      console.log(formData);
      if (createForm.soHC !== null) {
        this.HoChieuNGService.create(formData).subscribe({ next: (response) => this.processSuscess(response), error: response => this.processError(response) });
      }
    }
  }

  private processSuscess(response): void {
    console.log(response);
    if (Number(response.status) != 200) {
      this.alert.error('Thêm mới không thành công');
      //this.toast.addAlert({ message: 'Thêm mới không thành công', type: 'danger', toast: true, timeout: 1000 });
    } else {
      this.router.navigate(['/HoChieu/quanlyHCNgoaiGiao']);
      this.alert.success('Thêm mới hộ chiếu thành công');
      //this.toast.addAlert({ message: 'Thêm mới hộ chiếu thành công', type: 'success', toast: true, timeout: 1000 });

    }
  }

  private processError(response: HttpErrorResponse): void {
    if (Number(response.status) != 200) {
      this.alert.error('Thêm mới không thành công');
      //this.toast.addAlert({ message: 'Thêm mới không thành công', type: 'danger', toast: true });
    } else {
      this.router.navigate(['/HoChieu/quanlyHCNgoaiGiao']);
      this.alert.success('Thêm mới hộ chiếu thành công');
      //this.toast.addAlert({ message: 'Thêm mới hộ chiếu thành công', type: 'success', toast: true });

    }
  }

  previousState(): void {
    window.history.back();
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = "";
  editFile: boolean = true;
  removeUpload: boolean = false;

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
  }

  checkNameFile = true;
  nameFile: string[] = [];

  handleFileInput = async (event) => {
    this.selectedFile = event.target.files;

    HCNGTemplate.fileHoSo = event.target.files;
    this.isuploadDocument = false;
    if (HCNGTemplate.fileHoSo.length > 0) {
      for (let i = 0; i < HCNGTemplate.fileHoSo.length; i++) {
        this.fileToUpload = HCNGTemplate.fileHoSo.item(i);
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
              AttachmentContent: await this.readUploadedFileAsDataUrl(HCNGTemplate.fileHoSo.item(i))
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

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  remove(filename: string, i: number): void {
    this.fileList.splice(i, 1);
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