import { Component, Injectable, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlDirective, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/core/util/alert.service';
import { ILanhDao } from '../lanhDao.model';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { IDoanRa } from '../doanRa.model';
import { DoanRaService } from '../service/delegation-out.service';
import { IQGiaDen } from '../qGiaDen.model';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { SessionStorageService } from 'ngx-webstorage';



const doanRaTemplate = {} as IDoanRa;
const lanhDaoTemplate = {} as ILanhDao;
const qGiaDenTemplate = {} as IQGiaDen;
const lanhDao = new FormArray([]);
const quocGia = new FormArray([]);
const newDelegationIn: IDoanRa = {

} as IDoanRa;

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

export interface IFileUpload {
  RequestID: string;
  AttachmentName: string;
  AttachmentContent: any;
  FormType: string;
  AttachmentFlag: boolean;
}
declare var $: any;
@Component({
  selector: 'jhi-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
@Injectable()
export class DoanRaCreateComponent implements OnInit {
  authorities: string[] = [];
  isSaving = false;
  showEditable: boolean = false;
  editRowId: any;
  isuploadDocument: boolean;
  fileToUpload: File = null;
  fileUploaded: IFileUpload = null;
  lstUploadedFiles: IFileUpload[] = [];
  totalFileSize: number;
  selectedFile = null;
  maDoanV = null;
  success = false;
  errorPassportExists = false;
  error = false;
  isShowSideBar = true;
  disableTextbox = false;
  fileList: File[] = [];
  createFormMV: any;
  maDoanRa: number;
  quocGiaList: User[] | null = null;
  quocGiaGet: User | null = null;
  tenQG: string[] = [];
  checkNameFile = true;
  nameFile: string[] = [];
  ngayNCModel:any;
  ngayXCModel:any;
  currentPath: string;
  userName: string = this.sessionStorageService.retrieve('userName');
  createForm = new FormGroup({
    maDoan: new FormControl(doanRaTemplate.maDoan),
    tenDoan: new FormControl(doanRaTemplate.tenDoan, {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    truongDoan: new FormControl(doanRaTemplate.truongDoan, {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    chucVu: new FormControl(doanRaTemplate.chucVu),
    quocGia: new FormControl(doanRaTemplate.quocGia),
    mucDichHD: new FormControl(doanRaTemplate.mucDichHD),
    ngayNC: new FormControl(doanRaTemplate.ngayNC),
    ngayXC: new FormControl(doanRaTemplate.ngayXC, {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    soNgay: new FormControl(doanRaTemplate.soNgay),
    noiLuuTru: new FormControl(doanRaTemplate.noiLuuTru),
    ghiChu: new FormControl(doanRaTemplate.ghiChu),
    soLuongTV: new FormControl(doanRaTemplate.soLuongTV),
    listFile: new FormControl(doanRaTemplate.listFile),
    createdBy: new FormControl(doanRaTemplate.createdBy),
    updatedBy: new FormControl(doanRaTemplate.updatedBy),
    createdDate: new FormControl(doanRaTemplate.createdDate),
    updatedDate: new FormControl(doanRaTemplate.updatedDate),
    jsonLanhDao: lanhDao,
    jsonHoSoDtl: quocGia,
  });

  constructor(
    private doanRaService: DoanRaService,
    private qGService: QuocgiavavunglanhthoService,
    private route: ActivatedRoute,
    public alert: AlertServiceCheck,
    private router: Router,
    private navbarService: NavBarService,
    private sessionStorageService: SessionStorageService,
    ) 
    {}

  handleChange($event) {
    let index = $event.target.selectedIndex - 1;
    console.log(this.quocGiaList[index]);
    this.tenQG.push(this.quocGiaList[index].ten);
  }


  ngOnInit(): void {
    lanhDao.clear();
    quocGia.clear();
    this.qGService
      .getAll()
      .subscribe({
        next: (res: HttpResponse<User[]>) => {
          this.onSuccessQG(res.body, res.headers);
        },
      });
    this.totalFileSize = 0;
    this.route.data.subscribe(({ delegationIn }) => {
      if (delegationIn) {
        this.createForm.reset(delegationIn);
      } else {
        this.createForm.reset(newDelegationIn);
      }
    });
    this.doanRaService.authorities().subscribe(authorities => (this.authorities = authorities));
    console.log(this.disableTextbox);
    lanhDao.push(
      new FormGroup({
        iD: new FormControl(lanhDaoTemplate.iD == null ? 0 : lanhDaoTemplate.iD),
        maHSDoan: new FormControl(lanhDaoTemplate.maHSDoan),
        hoTen: new FormControl(lanhDaoTemplate.hoTen),
      }),
    );

    quocGia.push(
      new FormGroup({
        iD: new FormControl(qGiaDenTemplate.iD == null ? 0 : qGiaDenTemplate.iD),
        maHSDoan: new FormControl(qGiaDenTemplate.maHSDoan),
        maQG: new FormControl(qGiaDenTemplate.quocGia),
        quocGia: new FormControl(''),
        chuongTrinhHD: new FormControl(qGiaDenTemplate.chuongTrinhHD),
        noiLuuTru: new FormControl(qGiaDenTemplate.noiLuuTru),
        soNgayLuuTru: new FormControl(qGiaDenTemplate.soNgayLuuTru),
        soLuongTV: new FormControl(qGiaDenTemplate.soLuongTV)
      }),
    );
    this.currentPath = this.router.url;
    console.log(this.currentPath)
    this.navbarService.getSubPath(this.currentPath, 'Thêm mới')
  }

  private onSuccessQG(users: User[] | null, headers: HttpHeaders): void {
    this.quocGiaList = users;
  }

  addTableHDTCDP() {
    (<FormArray>this.createForm.get('jsonHoSoDtl')).push(
      new FormGroup({
        iD: new FormControl(qGiaDenTemplate.iD == null ? 0 : qGiaDenTemplate.iD),
        maHSDoan: new FormControl(qGiaDenTemplate.maHSDoan),
        maQG: new FormControl(qGiaDenTemplate.maQG),
        chuongTrinhHD: new FormControl(qGiaDenTemplate.chuongTrinhHD),
        noiLuuTru: new FormControl(qGiaDenTemplate.noiLuuTru),
        soNgayLuuTru: new FormControl(qGiaDenTemplate.soNgayLuuTru),
        soLuongTV: new FormControl(qGiaDenTemplate.soLuongTV)
      })
    );
  }

  deleteRowHDTCDP(index: number) {
    var delBtn_leng = (<FormArray>this.createForm.get('jsonHoSoDtl')).length
    if(delBtn_leng > 1 ){
      var delBtn = confirm(" Bạn có muốn xóa không ?");
      if (delBtn == true) {
        (<FormArray>this.createForm.get('jsonHoSoDtl')).removeAt(index);
      }
    }else{
      this.alert.warn('Dòng này không thể xóa!');
    }
  }

  addTableLDTD() {
    (<FormArray>this.createForm.get('jsonLanhDao')).push(
      new FormGroup({
        iD: new FormControl(lanhDaoTemplate.iD),
        maHSDoan: new FormControl(lanhDaoTemplate.maHSDoan),
        hoTen: new FormControl(lanhDaoTemplate.hoTen),
      })
    );
  }

  deleteRowLDTD(index: number) {
    var delBtn_leng = (<FormArray>this.createForm.get('jsonLanhDao')).length
    if (delBtn_leng > 1) {
      var delBtn = confirm(" Bạn có muốn xóa không ?");
      if (delBtn == true) {
        (<FormArray>this.createForm.get('jsonLanhDao')).removeAt(index);
      }
    } else {
      this.alert.warn('Dòng này không thể xóa!');
    }
  }

  get lanhDaoControls() {
    // a getter!
    return (<FormArray>this.createForm.get('jsonLanhDao')).controls;
  }

  get qGiaDenControls() {
    // a getter!
    return (<FormArray>this.createForm.get('jsonHoSoDtl')).controls;
  }

  handleFileInput = async (event) => {
    doanRaTemplate.listFile = event.target.files;
    this.isuploadDocument = false;
    if (doanRaTemplate.listFile.length > 0) {
      for (let i = 0; i < doanRaTemplate.listFile.length; i++) {
        this.fileToUpload = doanRaTemplate.listFile.item(i);
        this.checkNameFile = true;
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
              AttachmentContent: await this.readUploadedFileAsDataUrl(doanRaTemplate.listFile.item(i))
            };
            this.lstUploadedFiles.push(this.fileUploaded);
            this.fileList.push(doanRaTemplate.listFile[i]);
            this.nameFile.push(this.fileToUpload.name);
            console.log('lstUploadedFiles' + this.lstUploadedFiles);
            this.isuploadDocument = true;
          } else {
            this.isuploadDocument = false;
            // this.toastrService.error('Combined file size must not exceed 4 MB', 'Error!');
            this.alert.warn('Tải file không quá 100 MB!')
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
    this.fileList.splice(i,1);
    this.nameFile.splice(i,1);
    $('#inputGroupFile').val(null);
    doanRaTemplate.listFile = [].slice.call(doanRaTemplate.listFile).filter(e => e.name !== filename);
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

  createDV(): void {
    var percentDone = "0%";
    var flagCheck = false;
    this.isSaving = true;
    const payload = new FormData();
    this.createFormMV = this.createForm.value
    if(this.createFormMV.ngayNC != null && this.createFormMV.ngayXC != null) {
      if(this.createFormMV.ngayXC > this.createFormMV.ngayNC) {
        this.alert.warn("Ngày xuất cảnh không được lớn hơn ngày nhập cảnh")
        $('#ngayXC').focus();
        flagCheck = true;
      }
    } 
    if(flagCheck == false) {
      payload.append('maDoan', this.createFormMV.maDoan == null ? "" : this.createFormMV.maDoan.toString());
      payload.append('tenDoan', this.createFormMV.tenDoan == null ? "" : this.createFormMV.tenDoan);
      payload.append('truongDoan', this.createFormMV.truongDoan == null ? "" : this.createFormMV.truongDoan);
      payload.append('chucVu', this.createFormMV.chucVu == null ? "" : this.createFormMV.chucVu);
      payload.append('mucDichHD', this.createFormMV.mucDichHD == null ? "" : this.createFormMV.mucDichHD);
      payload.append('ngayNC', $('#ngayNC').first().val());
      payload.append('ngayXC', $('#ngayXC').first().val());
      payload.append('soNgay', this.createFormMV.soNgay == null ? "0" : this.createFormMV.soNgay.toString());
      payload.append('noiLuuTru', this.createFormMV.noiLuuTru == null ? "" : this.createFormMV.noiLuuTru);
      payload.append('ghiChu', this.createFormMV.ghiChu == null ? "" : this.createFormMV.ghiChu);
      payload.append('soLuongTV', this.createFormMV.soLuongTV == null ? "0" : this.createFormMV.soLuongTV.toString());
      payload.append('createdBy', this.userName);
      payload.append('createdDate', this.createFormMV.createdDate == null ? "" : this.createFormMV.createdDate.toString());
      payload.append('updatedDate', this.createFormMV.updatedDate == null ? "" : this.createFormMV.updatedDate.toString());
      for (let i = 0; i < this.fileList.length; i++) {
        console.log('filetesst' + this.fileList[i]);
        // this.selectedFile = this.lstUploadedFiles[i];
        // console.log('lưu' + this.lstUploadedFiles[i]);
        payload.append('listFile', this.fileList[i]);
        // payload.append('addressProofDoc', this.selectedFile[i]);
      }
      if (this.createFormMV.jsonLanhDao.length > 0) {
        payload.append('jsonLanhDao', JSON.stringify(this.createFormMV.jsonLanhDao));
      }
      if (this.createFormMV.jsonHoSoDtl.length > 0) {
        payload.append('JsonHoSoDtl', JSON.stringify(this.createFormMV.jsonHoSoDtl));
      }
  
      console.log(payload.getAll('listFile'));
      if (this.createFormMV.tenDoan !== null) {
        this.doanRaService.create(payload).subscribe({ next: () => (this.success = false), error: response => this.processError(response) });
      }
    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status !== 200) {
      this.alert.error('Thêm mới không thành công');
    } else {
      this.alert.success('Lưu thành công. Vui lòng chọn "Thêm mới thành viên" để thêm mới thành viên đoàn ra');
      this.isShowSideBar = !this.isShowSideBar;
      this.disableTextbox = !this.disableTextbox;
      this.createFormMV.maDoan = response.error.text;
      this.maDoanRa = response.error.text;
    }
  }


  private onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  private onSaveError(): void {
    this.isSaving = false;
  }

  previousState(): void {
    window.history.back();
  }
  maDoanField = '';

  get maDoanValue() {
    return this.maDoanField;
  }
  set maDoanValue(c: any) {
    this.maDoanField = c;
  }

  showSideBar(): void {
    this.isShowSideBar = !this.isShowSideBar;
    this.disableTextbox = !this.disableTextbox;
    console.log("Aaa" + this.disableTextbox);
  }
  onCreateTV() {
    this.router.navigateByUrl('/doanRa/quanLyTVRa/new', { state: this.createFormMV });
  }

  isInvalidDateNgayNC(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày nhập cảnh theo định dạng DD/MM/YYYY")
      $('#ngayNC').focus
    }
  }

  isInvalidDateNgayXC(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày xuất cảnh theo định dạng DD/MM/YYYY")
      $('#ngayXC').focus
  }
}


  checkDateNgayNC($event) {
    this.ngayNCModel = $event;
      if (this.ngayNCModel != null && this.ngayXCModel != null) {
        if (this.ngayNCModel < this.ngayXCModel) {
          $('#ngayNC').val(null)
          this.alert.warn("Vui lòng nhập Ngày xuất cảnh nhỏ hơn Ngày nhập cảnh")
          $('#ngayNC').focus()
        } else {
          this.showEditable = true;
        }
      }
  }
  
  checkDateNgayXC($event) {
    this.ngayXCModel = $event;
      if (this.ngayNCModel != null && this.ngayXCModel != null) {
        if (this.ngayNCModel < this.ngayXCModel) {
          $('#ngayXC').val(null)
          this.alert.warn("Vui lòng nhập Ngày nhập cảnh lớn hơn Ngày xuất cảnh")
          $('#ngayXC').focus()
        } else {
          this.showEditable = true;
        }
      }
  }

  value:any;
  numberOnlywithForwardSlash(event): boolean {
    const charCode = (event.which) ? (event.which) : (event.keyCode);
    this.value = (<HTMLInputElement>event.target).value
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 47) {
      return false;
    }
    if (event.keyCode == 47 && this.value.split('/').length === 3) {
      return false;
    }
    return true;
  }
}




