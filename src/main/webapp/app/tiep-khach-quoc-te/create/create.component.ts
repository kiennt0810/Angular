import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ITKQTThongTinVM } from '../TKQTThongTinVM.model';
import { TiepkhachquocteService } from '../service/tiepkhachquoctet.service';
import { ITKQTThanhVienVM } from '../TKQTThanhVienVM.model';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { HttpResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { ChucVuService } from 'app/quanlydanhmuc/ChucVu/ChucVu.service';
import { ChucVu } from 'app/quanlydanhmuc/ChucVu/ChucVu.model';
import { SessionStorageService } from 'ngx-webstorage';
const delegationInTemplate = {} as ITKQTThongTinVM;
const delegationInTVTemplate = {} as ITKQTThanhVienVM;
const danhSachCN = new FormArray([]);
const danhSachKhach = new FormArray([]);
const newDelegationIn: ITKQTThongTinVM = {

} as ITKQTThongTinVM;


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
  ],

})
export class CreateComponent implements OnInit {
  authorities: string[] = [];
  nameFile: string[] = [];
  chucVus: ChucVu[] | null = null;
  isSaving = false;
  checkNameFile = true;
  showEditable: boolean = false;
  editRowId: any;
  isuploadDocument: boolean;
  fileList: File[] = [];
  fileToUpload: File = null;
  fileUploaded: IFileUpload = null;
  lstUploadedFiles: IFileUpload[] = [];
  totalFileSize: number;
  selectedFile = null;
  showWarning1 = false;
  showWarning2 = false;
  showWarning3 = false;
  errorPassportExists = false;
  error = false;
  success = false;
  formatDateTGT: boolean;
  formatDateTGD: boolean;
  quocGia: User[] | null = null;
  currentPath: string;
  userName: string = this.sessionStorageService.retrieve('userName');

  constructor(
    private tiepkhachquocteService: TiepkhachquocteService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private qGService: QuocgiavavunglanhthoService,
    private router: Router,
    private alert: AlertServiceCheck,
    private navbarService: NavBarService,
    private ChucVuService: ChucVuService,
    private sessionStorageService: SessionStorageService,
  ) { }

  createForm = new FormGroup({
    lanhDao: new FormControl(delegationInTemplate.lanhDao, {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    chucVu: new FormControl(delegationInTemplate.chucVu),
    doanKhach: new FormControl(delegationInTemplate.doanKhach, { validators: [Validators.required] }),
    quocGia: new FormControl(delegationInTemplate.quocGia, { validators: [Validators.required] }),
    diaDiem: new FormControl(delegationInTemplate.diaDiem),
    hinhThuc: new FormControl(delegationInTemplate.hinhThuc),
    coQuan: new FormControl(delegationInTemplate.coQuan),
    thoiGianTu: new FormControl(delegationInTemplate.thoiGianTu),
    thoiGianDen: new FormControl(delegationInTemplate.thoiGianDen),
    soLuongTV: new FormControl(delegationInTemplate.soLuongTV),
    tinhTrang: new FormControl(delegationInTemplate.tinhTrang),
    listFile: new FormControl(delegationInTemplate.listFile),
    createdBy: new FormControl(delegationInTemplate.createdBy),
    updatedBy: new FormControl(delegationInTemplate.updatedBy),
    createdDate: new FormControl(delegationInTemplate.createdDate),
    updatedDate: new FormControl(delegationInTemplate.updatedDate),
    tkqtThanhVienCN: danhSachCN,
    tkqtThanhVienKhach: danhSachKhach,
  });




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
    const tkqtThanhVienKhachArray = <FormArray>this.createForm.get('tkqtThanhVienKhach');
    this.clearFormArray(tkqtThanhVienKhachArray);
    const tkqtThanhVienCNArray = <FormArray>this.createForm.get('tkqtThanhVienCN');
    this.clearFormArray(tkqtThanhVienCNArray);
    this.route.data.subscribe(({ delegationIn }) => {
      if (delegationIn) {
        this.createForm.reset(delegationIn);
      } else {
        this.createForm.reset(newDelegationIn);
      }
    });
    const test = this.createForm.getRawValue()
    console.log(test.tkqtThanhVienKhach[0].ngaySinh);
    this.currentPath = this.router.url;
    console.log(this.currentPath)
    this.navbarService.getSubPath(this.currentPath, 'Thêm mới');
    this.loadAllChucVu();
  }
  private onSuccessQG(qG: User[] | null, headers: HttpHeaders): void {
    this.quocGia = qG;
  }
  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 1) {
      formArray.removeAt(0);
    }
  }

  loadAllChucVu(): void {
    this.ChucVuService.getLstChucVu().subscribe({
      next: (res: HttpResponse<ChucVu[]>) => {
        this.onSuccessLstChucVu(res.body);
      }
    });
  }
  private onSuccessLstChucVu(chucVu: ChucVu[] | null): void {
    this.chucVus = chucVu;
  }

  addTableKhach() {
    (<FormArray>this.createForm.get('tkqtThanhVienKhach')).push(
      new FormGroup({
        hoTen: new FormControl(delegationInTVTemplate.hoTen, { validators: [Validators.required] }),
        gioiTinh: new FormControl(delegationInTVTemplate.gioiTinh, { validators: [Validators.required] }),
        ngaySinh: new FormControl(delegationInTVTemplate.ngaySinh, { validators: [Validators.required] }),
        chucVu: new FormControl(delegationInTVTemplate.chucVu),
        coQuan: new FormControl(delegationInTVTemplate.coQuan),
      })
    );
  }

  deleteRowKhach(index: number) {
    var delBtn_leng = (<FormArray>this.createForm.get('tkqtThanhVienKhach')).length
    if (delBtn_leng > 1) {
      var delBtn = confirm(" Bạn có muốn xóa không ?");
      if (delBtn == true) {
        (<FormArray>this.createForm.get('tkqtThanhVienKhach')).removeAt(index);
      }
    } else {
      this.alert.warn('Dòng này không thể xóa!');
    }

  }

  addTableCN() {
    (<FormArray>this.createForm.get('tkqtThanhVienCN')).push(
      new FormGroup({
        hoTen: new FormControl(delegationInTVTemplate.hoTen, { validators: [Validators.required] }),
        gioiTinh: new FormControl(delegationInTVTemplate.gioiTinh, { validators: [Validators.required] }),
        ngaySinh: new FormControl(delegationInTVTemplate.ngaySinh, { validators: [Validators.required] }),
        chucVu: new FormControl(delegationInTVTemplate.chucVu),
        coQuan: new FormControl(delegationInTVTemplate.coQuan),

      })
    );
  }

  deleteRowCN(index: number) {
    var delBtn_leng = (<FormArray>this.createForm.get('tkqtThanhVienCN')).length
    if (delBtn_leng > 1) {
      var delBtn = confirm(" Bạn có muốn xóa không ?");
      if (delBtn == true) {
        (<FormArray>this.createForm.get('tkqtThanhVienCN')).removeAt(index);
      }
    } else {
      this.alert.warn('Dòng này không thể xóa!');
    }
  }

  get controls_Khach() {
    // a getter!
    return (<FormArray>this.createForm.get('tkqtThanhVienKhach')).controls;
  }

  get controls_CN() {
    // a getter!
    return (<FormArray>this.createForm.get('tkqtThanhVienCN')).controls;
  }

  handleFileInput = async (event) => {
    delegationInTemplate.listFile = event.target.files;
    this.isuploadDocument = false;
    if (delegationInTemplate.listFile.length > 0) {
      for (let i = 0; i < delegationInTemplate.listFile.length; i++) {
        this.fileToUpload = delegationInTemplate.listFile.item(i);
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
              AttachmentContent: await this.readUploadedFileAsDataUrl(delegationInTemplate.listFile.item(i))
            };
            this.lstUploadedFiles.push(this.fileUploaded);
            this.fileList.push(delegationInTemplate.listFile[i]);
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

  isInvalidDate1(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY');
      event.target.value = null
      $('#thoiGianTu').focus();
    }

  }

  isInvalidDate2(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY');
      event.target.value = null
      $('#thoiGianDen').focus();
    }

  }
  remove(filename: string, i: number): void {
    this.fileList.splice(i, 1);
    this.nameFile.splice(i, 1);
    $('#inputGroupFile').val(null);
    delegationInTemplate.listFile = [].slice.call(delegationInTemplate.listFile).filter(e => e.name !== filename);
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
        reject(this.alert.warn('Không thể tải file'));
      };
      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsDataURL(inputFile);
    });
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
  changeTGT() {
    this.formatDateTGT = false;
  }


  isInvalidDate3(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY');
      event.target.value = null
    }

  }


  changeTGD() {
    this.formatDateTGD = false;
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }

  compareDateHL(d1: string, d2: string) {
    let [day, month, year] = d1.split('/');
    const TuNgay = new Date(+year, +month - 1, +day).getTime();
    let [day2, month2, year2] = d2.split('/');
    const DenNgay = new Date(+year2, +month2 - 1, +day2).getTime();
    if (TuNgay < DenNgay) {
      return true;
    } else if (TuNgay > DenNgay) {
      return false;
    } else {
      return true;
    }
  };


  createDV(): void {
    this.isSaving = true;
    const payload = new FormData();
    const createForm = this.createForm.value;
    createForm.thoiGianTu = $('#thoiGianTu').first().val();
    createForm.thoiGianDen = $('#thoiGianDen').first().val();
    createForm.chucVu = $('#chucVu').first().val();
    var checkdate = false;
    if (String(createForm.chucVu) == '') {
      createForm.chucVu = '';
    }
    if ($('#lanhDao').val() == '') {
      this.alert.warn('Lãnh đạo tiếp khách không được để trống');
      $('#lanhDao').focus();
    } else if ((createForm.thoiGianTu != '' && createForm.thoiGianDen != '')) {
      if (!this.compareDateHL(createForm.thoiGianTu, createForm.thoiGianDen)) {
        this.alert.warn('Từ ngày không được lớn hơn Đến ngày');
        $('#thoiGianDen').focus();
      } else {
        createForm.thoiGianTu = $('#thoiGianTu').first().val();
        createForm.thoiGianDen = $('#thoiGianDen').first().val();
        payload.append('lanhDao', createForm.lanhDao == null ? "" : createForm.lanhDao.toString());
        payload.append('chucVu', createForm.chucVu == null ? "" : createForm.chucVu.toString());
        payload.append('coQuan', createForm.coQuan == null ? "" : createForm.coQuan.toString());
        payload.append('doanKhach', createForm.doanKhach == null ? "" : createForm.doanKhach.toString());
        payload.append('quocGia', createForm.quocGia == null ? "" : createForm.quocGia.toString());
        payload.append('thoiGianTu', createForm.thoiGianTu == null ? "" : createForm.thoiGianTu.toString());
        payload.append('thoiGianDen', createForm.thoiGianDen == null ? "" : createForm.thoiGianDen.toString());
        payload.append('diaDiem', createForm.diaDiem == null ? "" : createForm.diaDiem.toString());
        payload.append('hinhThuc', createForm.hinhThuc == null ? "" : createForm.hinhThuc.toString());
        payload.append('createdBy', this.userName);
        payload.append('createdDate', createForm.createdDate == null ? "" : createForm.createdDate.toString());
        payload.append('updatedDate', createForm.updatedDate == null ? "" : createForm.updatedDate.toString());
        for (let i = 0; i < this.fileList.length; i++) {
          console.log('filetesst' + this.fileList[i]);
          payload.append('listFile', this.fileList[i]);
        }
        for (let i = 0; i < createForm.tkqtThanhVienKhach.length; i++) {
          createForm.tkqtThanhVienKhach[i].type = 1;
          createForm.tkqtThanhVienKhach[i].id = 0;
          createForm.tkqtThanhVienKhach[i].ngaySinh = $('#ngaySinhTVKhach' + i).first().val();
          if (String(createForm.tkqtThanhVienKhach[i].ngaySinh) == '') {
            createForm.tkqtThanhVienKhach[i].ngaySinh = '';
          } else if (!this.compareDate(createForm.tkqtThanhVienKhach[i].ngaySinh)) {
            this.alert.warn('Ngày sinh không được lớn hơn ngày hiện tại!');
            $('#ngaySinhTVKhach' + i).focus();
            checkdate = true;
            break;
          }
        }

        for (let i = 0; i < createForm.tkqtThanhVienCN.length; i++) {
          createForm.tkqtThanhVienCN[i].type = 0;
          createForm.tkqtThanhVienCN[i].id = 0;
          createForm.tkqtThanhVienCN[i].ngaySinh = $('#ngaySinhTVCN' + i).first().val();
          if (String(createForm.tkqtThanhVienCN[i].ngaySinh) == '') {
            createForm.tkqtThanhVienCN[i].ngaySinh = '';
          } else if (!this.compareDate(createForm.tkqtThanhVienCN[i].ngaySinh)) {
            this.alert.warn('Ngày sinh không được lớn hơn ngày hiện tại!');
            $('#ngaySinhTVCN' + i).focus();
            checkdate = true;
            break;
          }
        }

        payload.append('JsonKhach', JSON.stringify(createForm.tkqtThanhVienKhach));
        payload.append('JsonThanhVien', JSON.stringify(createForm.tkqtThanhVienCN));
        console.log(payload.getAll('listFile'));
        if (createForm.lanhDao !== null && checkdate == false) {
          this.tiepkhachquocteService.create(payload).subscribe({ next: (response) => this.processSuscess(response), error: response => this.processError(response) });
        }
      }
    } else {
      createForm.thoiGianTu = $('#thoiGianTu').first().val();
      createForm.thoiGianDen = $('#thoiGianDen').first().val();
      payload.append('lanhDao', createForm.lanhDao == null ? "" : createForm.lanhDao.toString());
      payload.append('chucVu', createForm.chucVu == null ? "" : createForm.chucVu.toString());
      payload.append('coQuan', createForm.coQuan == null ? "" : createForm.coQuan.toString());
      payload.append('doanKhach', createForm.doanKhach == null ? "" : createForm.doanKhach.toString());
      payload.append('quocGia', createForm.quocGia == null ? "" : createForm.quocGia.toString());
      payload.append('thoiGianTu', createForm.thoiGianTu == null ? "" : createForm.thoiGianTu.toString());
      payload.append('thoiGianDen', createForm.thoiGianDen == null ? "" : createForm.thoiGianDen.toString());
      payload.append('diaDiem', createForm.diaDiem == null ? "" : createForm.diaDiem.toString());
      payload.append('hinhThuc', createForm.hinhThuc == null ? "" : createForm.hinhThuc.toString());
      payload.append('createdBy', this.userName);
      payload.append('createdDate', createForm.createdDate == null ? "" : createForm.createdDate.toString());
      payload.append('updatedDate', createForm.updatedDate == null ? "" : createForm.updatedDate.toString());
      for (let i = 0; i < this.fileList.length; i++) {
        console.log('filetesst' + this.fileList[i]);
        payload.append('listFile', this.fileList[i]);
      }
      for (let i = 0; i < createForm.tkqtThanhVienKhach.length; i++) {
        createForm.tkqtThanhVienKhach[i].type = 1;
        createForm.tkqtThanhVienKhach[i].id = 0;
        createForm.tkqtThanhVienKhach[i].ngaySinh = $('#ngaySinhTVKhach' + i).first().val();
        if (String(createForm.tkqtThanhVienKhach[i].ngaySinh) == '') {
          createForm.tkqtThanhVienKhach[i].ngaySinh = '';
        } else if (!this.compareDate(createForm.tkqtThanhVienKhach[i].ngaySinh)) {
          this.alert.warn('Ngày sinh không được lớn hơn ngày hiện tại!');
          $('#ngaySinhTVKhach' + i).focus();
          checkdate = true;
          break;
        }
      }

      for (let i = 0; i < createForm.tkqtThanhVienCN.length; i++) {
        createForm.tkqtThanhVienCN[i].type = 0;
        createForm.tkqtThanhVienCN[i].id = 0;
        createForm.tkqtThanhVienCN[i].ngaySinh = $('#ngaySinhTVCN' + i).first().val();
        if (String(createForm.tkqtThanhVienCN[i].ngaySinh) == '') {
          createForm.tkqtThanhVienCN[i].ngaySinh = '';
        } else if (!this.compareDate(createForm.tkqtThanhVienCN[i].ngaySinh)) {
          this.alert.warn('Ngày sinh không được lớn hơn ngày hiện tại!');
          $('#ngaySinhTVCN' + i).focus();
          checkdate = true;
          break;
        }
      }

      payload.append('JsonKhach', JSON.stringify(createForm.tkqtThanhVienKhach));
      payload.append('JsonThanhVien', JSON.stringify(createForm.tkqtThanhVienCN));
      console.log(payload.getAll('listFile'));
      if (createForm.lanhDao !== null && checkdate == false) {
        this.tiepkhachquocteService.create(payload).subscribe({ next: (response) => this.processSuscess(response), error: response => this.processError(response) });
      }
    }
  }

  private processSuscess(response): void {
    console.log(response);
    if (Number(response.status) != 200) {
      this.alert.error('Thêm mới không thành công');
    } else {
      this.router.navigate(['/tiep-khach-quoc-te']);
      this.alert.success('Thêm mới thành công');

    }
  }


  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === "LOGIN_ALREADY_USED_TYPE") {
      this.errorPassportExists = true;
    } else {
      this.error = true;
    }
  }
}

danhSachCN.push(
  new FormGroup({
    id: new FormControl(delegationInTVTemplate.id),
    soHC: new FormControl(delegationInTVTemplate.soHC),
    hoTen: new FormControl(delegationInTVTemplate.hoTen),
    chucVu: new FormControl(delegationInTVTemplate.chucVu),
    coQuan: new FormControl(delegationInTVTemplate.coQuan),
    gioiTinh: new FormControl(delegationInTVTemplate.gioiTinh),
    ngaySinh: new FormControl(delegationInTVTemplate.ngaySinh),
    type: new FormControl(delegationInTVTemplate.type),
  }),
);
danhSachKhach.push(
  new FormGroup({
    id: new FormControl(delegationInTVTemplate.id),
    soHC: new FormControl(delegationInTVTemplate.soHC),
    hoTen: new FormControl(delegationInTVTemplate.hoTen),
    chucVu: new FormControl(delegationInTVTemplate.chucVu),
    coQuan: new FormControl(delegationInTVTemplate.coQuan),
    gioiTinh: new FormControl(delegationInTVTemplate.gioiTinh),
    ngaySinh: new FormControl(delegationInTVTemplate.ngaySinh),
    type: new FormControl(delegationInTVTemplate.type),
  }),
);

