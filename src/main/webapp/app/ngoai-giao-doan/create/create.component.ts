import { Component, Injectable, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { IHDNgoaiGiaoVM } from '../HDNgoaiGiaoVM.model';
import { NgoaiGiaoDoanService } from '../service/ngoai-giao-doan.service';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IHDNgoaiGiaoDtlVM, HDNgoaiGiaoDtlVM } from '../HDNgoaiGiaoDtlVM.model';
import { AlertService } from 'app/core/util/alert.service';
import { HttpResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { SessionStorageService } from 'ngx-webstorage';
const delegationInTemplate = {} as IHDNgoaiGiaoVM;
const delegationInTVTemplate = {} as IHDNgoaiGiaoDtlVM;
const danhSach = new FormArray([]);
const newDelegationIn: IHDNgoaiGiaoVM = {

} as IHDNgoaiGiaoVM;


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
})
export class CreateComponent implements OnInit {
  authorities: string[] = [];
  nameFile: string[] = [];
  checkNameFile = true;
  isSaving = false;
  showEditable: boolean = false;
  editRowId: any;
  isuploadDocument: boolean;
  fileList: File[] = [];
  fileToUpload: File = null;
  fileUploaded: IFileUpload = null;
  lstUploadedFiles: IFileUpload[] = [];
  totalFileSize: number;
  selectedFile = null;
  listFileAll: FileList[] = [];
  errorPassportExists = false;
  quocGia: User[] | null = null;
  error = false;
  success = false;
  showWarning = false;
  currentPath: string;
  disableTextbox = false;
  tangPham: any[];
  tangPhamKhac = false;
  tangHoa: string;

  createForm = new FormGroup({
    tenHD: new FormControl(delegationInTemplate.tenHD, { validators: [Validators.required] }),
    coQuan: new FormControl(delegationInTemplate.coQuan),
    quocGia: new FormControl(delegationInTemplate.quocGia),
    hinhThuc: new FormControl(delegationInTemplate.hinhThuc),
    tangPham: new FormControl(delegationInTemplate.tangPham),
    thoiGian: new FormControl(delegationInTemplate.thoiGian, { validators: [Validators.required] }),
    diaDiem: new FormControl(delegationInTemplate.diaDiem),
    ghiChu: new FormControl(delegationInTemplate.ghiChu),
    fileHoSo: new FormControl(delegationInTemplate.fileHoSo),

    createdBy: new FormControl(delegationInTemplate.createdBy),
    updatedBy: new FormControl(delegationInTemplate.updatedBy),
    createdDate: new FormControl(delegationInTemplate.createdDate),
    updatedDate: new FormControl(delegationInTemplate.updatedDate),
    hdThanhPhanThamDu: danhSach,
  });


  constructor(
    private Service: NgoaiGiaoDoanService,
    private route: ActivatedRoute,
    private alert: AlertServiceCheck,
    private http: HttpClient,
    private qGService: QuocgiavavunglanhthoService,
    private router: Router,
    private navbarService: NavBarService,
    private sessionStorageService: SessionStorageService,
  ) { }

  filter = {};
  ngOnInit(): void {
    this.totalFileSize = 0;
    this.qGService
      .getAll()
      .subscribe({
        next: (res: HttpResponse<User[]>) => {
          this.onSuccessQG(res.body, res.headers);
        },
      });
    const hdThanhPhanThamDuArray = <FormArray>this.createForm.get('hdThanhPhanThamDu');
    this.clearFormArray(hdThanhPhanThamDuArray);
    this.route.data.subscribe(({ delegationIn }) => {
      if (delegationIn) {
        this.createForm.reset(delegationIn);
      } else {
        this.createForm.reset(newDelegationIn);
      }
    });
    this.currentPath = this.router.url;
    console.log(this.currentPath)
    this.navbarService.getSubPath(this.currentPath, 'Thêm mới');

    this.tangPham = [
      {
        id: 1,
        name: 'Hoa',
        checked: false
      },
      {
        id: 2,
        name: 'Quà',
        checked: false
      },
      {
        id: 3,
        name: 'Khác',
        checked: false
      },
    ];
  }

  get result() {
    this.tangPhamKhac = false;
    var tangPham = this.tangPham.filter(item => item.checked).map(item => item);
    for (let i = 0; i < tangPham.length; i++) {
      if (tangPham[i].name == 'Khác') {
        this.tangPhamKhac = true;
      }
    }
    return this.tangPhamKhac;
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 1) {
      formArray.removeAt(0);
    }
  }
  isInvalidDate(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.showWarning = true
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY!');
      event.target.value = null
    } else {
      this.showWarning = false
    }
  }
  addRowTable() {
    (<FormArray>this.createForm.get('hdThanhPhanThamDu')).push(
      new FormGroup({
        id: new FormControl(delegationInTVTemplate.id),
        hoTen: new FormControl(delegationInTVTemplate.hoTen),
        chucVu: new FormControl(delegationInTVTemplate.chucVu),
        coQuan: new FormControl(delegationInTVTemplate.coQuan),
        gioiTinh: new FormControl(delegationInTVTemplate.gioiTinh),
      })
    );
  }

  deleteRowTable(index: number) {
    var delBtn_leng = (<FormArray>this.createForm.get('hdThanhPhanThamDu')).length
    if (delBtn_leng > 1) {
      var delBtn = confirm(" Bạn có muốn xóa không ?");
      if (delBtn == true) {
        (<FormArray>this.createForm.get('hdThanhPhanThamDu')).removeAt(index);
      }
    } else {
      this.alert.warn('Dòng này không thể xóa!');
    }

  }
  private onSuccessQG(qG: User[] | null, headers: HttpHeaders): void {
    this.quocGia = qG;
  }

  get controls() {
    return (<FormArray>this.createForm.get('hdThanhPhanThamDu')).controls;
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  readUploadedFileAsDataUrl = (inputFile) => {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(this.alert.warn('Không thể tải file'));
      };
      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsDataURL(inputFile);
    });
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }

  createDV(): void {
    var count = 0;
    this.isSaving = true;
    const payload = new FormData();
    const createForm = this.createForm.value;
    createForm.thoiGian = $('#thoiGian').first().val();
    createForm.tangPham = $('#tangPham').first().val();
    let userName: string = this.sessionStorageService.retrieve('userName');
    if ($('#tenHD').val() == '') {
      this.alert.error('Tên hoạt động không được để trống!');
      $('#tenHD').focus();
    } else if ($('#thoiGian').val() == '') {
      this.alert.error('Thời gian không được để trống!');
      $('#thoiGian').focus();
    } else {
      payload.append('tenHD', createForm.tenHD == null ? "" : createForm.tenHD.toString());
      payload.append('coQuan', createForm.coQuan == null ? "" : createForm.coQuan.toString());
      payload.append('quocGia', createForm.quocGia == null ? "" : createForm.quocGia.toString());
      payload.append('hinhThuc', createForm.hinhThuc == null ? "" : createForm.hinhThuc.toString());
      payload.append('thoiGian', createForm.thoiGian == null ? "" : createForm.thoiGian.toString());
      payload.append('diaDiem', createForm.diaDiem == null ? "" : createForm.diaDiem.toString());
      payload.append('ghiChu', createForm.ghiChu == null ? "" : createForm.ghiChu.toString());
      for (let i = 0; i < this.fileList.length; i++) {
        payload.append('listFile', this.fileList[i]);
      }
      var tangPham = this.tangPham.filter(item => item.checked).map(item => item);
      for (let i = 0; i < tangPham.length; i++) {
        if (tangPham[i].checked) {
          if (count == 0) {
            this.tangHoa = tangPham[i].id.toString();
            count++;
          } else {
            this.tangHoa = this.tangHoa + "," + tangPham[i].id.toString();
          }
        }
      }
      if ((createForm.tangPham != null || createForm.tangPham != undefined) && this.tangHoa != '') {
        createForm.tangPham = ',' + createForm.tangPham;
      } else {
        createForm.tangPham = '';
      }
      for (let i = 0; i < createForm.hdThanhPhanThamDu.length; i++) {
        createForm.hdThanhPhanThamDu[i].id = 0;
        if (String(createForm.hdThanhPhanThamDu[i].gioiTinh) == 'null') {
          createForm.hdThanhPhanThamDu[i].gioiTinh = null;
        }
      }
      payload.append('tangHoa', this.tangHoa + createForm.tangPham);
      payload.append('jsonThanhPhanThamDu', JSON.stringify(createForm.hdThanhPhanThamDu));
      payload.append('createdBy', userName);
      payload.append('createdDate', createForm.createdDate == null ? "" : createForm.createdDate.toString());
      payload.append('updatedDate', createForm.updatedDate == null ? "" : createForm.updatedDate.toString());
      console.log(payload.getAll('listFile'));
      if (createForm.tenHD !== null) {
        this.Service.create(payload).subscribe({ next: (response) => this.processSuscess(response), error: response => this.processError(response) });
      }
    }
  }

  private processSuscess(response): void {
    console.log(response);
    if (Number(response.status) != 200) {
      this.alert.error('Thêm mới không thành công');
    } else {
      this.router.navigate(['/ngoai-giao-doan']);
      this.alert.success('Thêm mới thành công');
    }
  }

  private processError(response: HttpErrorResponse): void {
    this.alert.error('Thêm mới không thành công');
  }


  removeFile(filename: string, i: number): void {
    this.fileList.splice(i, 1);
    $('#inputGroupFile').val(null);
    delegationInTemplate.fileHoSo = [].slice.call(delegationInTemplate.fileHoSo).filter(e => e.name !== filename);
    this.lstUploadedFiles = this.lstUploadedFiles.filter(e => e.AttachmentName !== filename);
    this.totalFileSize = 0;
    this.lstUploadedFiles.forEach(fl => {
      this.totalFileSize = this.totalFileSize + fl.AttachmentContent.length;
    });
  }

  handleFileInput = async (event) => {
    this.selectedFile = event.target.files;

    delegationInTemplate.fileHoSo = event.target.files;
    this.isuploadDocument = false;
    if (delegationInTemplate.fileHoSo.length > 0) {
      for (let i = 0; i < delegationInTemplate.fileHoSo.length; i++) {
        this.fileToUpload = delegationInTemplate.fileHoSo.item(i);
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
              AttachmentContent: await this.readUploadedFileAsDataUrl(delegationInTemplate.fileHoSo.item(i))
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
}

danhSach.push(
  new FormGroup({
    id: new FormControl(delegationInTVTemplate.id),
    hoTen: new FormControl(delegationInTVTemplate.hoTen),
    chucVu: new FormControl(delegationInTVTemplate.chucVu),
    coQuan: new FormControl(delegationInTVTemplate.coQuan),
    gioiTinh: new FormControl(delegationInTVTemplate.gioiTinh),
  }),
);

