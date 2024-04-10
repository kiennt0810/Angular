import { ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IQuanLyTV } from '../quanLyTVRa.model';
import { QuanLyTVService } from '../service/quanLyTVRa.service';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IFileUploadVM } from 'app/quanLyDoan/file.model';
import { AlertService } from 'app/core/util/alert.service';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HChieuNGService } from 'app/quanLyHoChieu/quanlyHCNgoaiGiao/service/hoCNgoaiGiao.service';
import { FileUploadHC } from 'app/quanLyHoChieu/quanlyHCNgoaiGiao/file-HC.model';
import { DomSanitizer } from '@angular/platform-browser';
import { DoanRa } from 'app/quanLyDoan/quanLyDoanRa/doanRa.model';
import moment from 'moment';
import { Observable, map } from 'rxjs';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';

import { QGiaDen } from '../qGiaDen.model';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { DoanRaService } from 'app/quanLyDoan/quanLyDoanRa/service/delegation-out.service';
import { PassportService } from 'app/quanlydanhmuc/loaihochieu/loaihochieu.service';
import { Passport } from 'app/quanlydanhmuc/loaihochieu/loaihochieu.model';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const quanLyTVTemp = {} as IQuanLyTV;
const fileUploadVM = {} as IFileUploadVM;
const listDVFileVM = new FormArray([]);
const dSThanhVienDoan = new FormArray([]);
let fileImg = null;
import * as fileSaver from 'file-saver';
import { SessionStorageService } from 'ngx-webstorage';

const newQuanLyTV: IQuanLyTV = {

} as IQuanLyTV;

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
  styleUrls: ['../../../create.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})

export class CreateComponent implements OnInit {
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
  fileList: File[] = [];
  gioiTinhChoose: boolean;
  gioiTinhNum: any;
  inputFieldValue;
  tableData: any[] = [];
  success = false;
  errorPassportExists = false;
  error = false;
  listFileHC: FileUploadHC | null = null;
  doanRa: DoanRa | null = null;
  kTraHC: boolean;
  quocGiaList: User[] | null = null;
  passports: Passport[] | null = null;
  qGiaDen: QGiaDen[] | null = null;
  qGiaDenDoan: any;
  tenQG: any;
  countLisTV = 0;
  checkHC = false;
  ngayHL: any;
  ngayCap: any;
  ngayNCModel: any;
  ngayXCModel: any;
  countThem = 0;
  countXoa = 0;
  maThanhVien: string[] = [];
  checkNameFile = true;
  nameFile: string[] = [];
  gioiTinhSave: string;
  gioiTinhLoad: string;
  currentPath: string;
  idAnh: number;
  soHCKT: string;
  stt = 1;
  isThem = true
  ckSoTT = false;
  xoaFlag =false;
  themFlag=false;
  userName: string = this.sessionStorageService.retrieve('userName');
  createForm = new FormGroup({
    soTT: new FormControl(quanLyTVTemp.soTT),
    ckSoTT: new FormControl(quanLyTVTemp.ckSoTT),
    maTV: new FormControl(quanLyTVTemp.maTV),
    maHSDoan: new FormControl(quanLyTVTemp.maHSDoan),
    tenHSDoan: new FormControl(quanLyTVTemp.tenHSDoan),
    coQuan: new FormControl(quanLyTVTemp.coQuan),
    chucVu: new FormControl(quanLyTVTemp.chucVu),
    hoTen: new FormControl(quanLyTVTemp.hoTen),
    gioiTinh: new FormControl(quanLyTVTemp.gioiTinh ? '1' : null),
    ngaySinh: new FormControl(quanLyTVTemp.ngaySinh),
    noiLuuTru: new FormControl(quanLyTVTemp.noiLuuTru),
    ngayNC: new FormControl(quanLyTVTemp.ngayNC),
    ngayXC: new FormControl(quanLyTVTemp.ngayXC),
    tangPham: new FormControl(quanLyTVTemp.tangPham),
    soHoChieuKT: new FormControl(quanLyTVTemp.soHoChieuKT),
    soHoChieu: new FormControl(quanLyTVTemp.soHoChieu),
    hC_NgayCap: new FormControl(quanLyTVTemp.hC_NgayCap),
    hC_NgayHL: new FormControl(quanLyTVTemp.hC_NgayHL),
    hC_Loai: new FormControl(quanLyTVTemp.hC_Loai),
    hC_SoThiThuc: new FormControl(quanLyTVTemp.hC_SoThiThuc, {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    hC_NgayCapTT: new FormControl(quanLyTVTemp.hC_NgayCapTT, {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    maQG: new FormControl(quanLyTVTemp.maQG),
    quocGia: new FormControl(quanLyTVTemp.quocGia),
    listFile: new FormControl(quanLyTVTemp.listFile),
    fileHoChieu: new FormControl(quanLyTVTemp.fileHoChieu),
    strLsFileDelete: new FormControl(quanLyTVTemp.strLsFileDelete),
    fileUpList: new FormControl(quanLyTVTemp.fileUpList),
    fileHC: new FormControl(quanLyTVTemp.fileHC),
    dSThanhVienDoan: dSThanhVienDoan,
    type: new FormControl(),
  });
  get maTV(): any { return this.createForm.get('maTV'); }
  get coQuan(): any { return this.createForm.get('coQuan'); }
  get chucVu(): any { return this.createForm.get('chucVu'); }
  get hoTen(): any { return this.createForm.get('hoTen'); }
  get hoTenInvalid(): any { return this.createForm.get('hoTen').invalid; }
  get gioiTinhGet(): any { return this.createForm.get('gioiTinh'); }
  get ngaySinh(): any { return this.createForm.get('ngaySinh'); }
  get noiLuuTru(): any { return this.createForm.get('noiLuuTru'); }
  get ngayNC(): any { return this.createForm.get('ngayNC'); }
  get ngayXC(): any { return this.createForm.get('ngayXC'); }
  get tangPham(): any { return this.createForm.get('tangPham'); }
  get soHoChieuKT(): any { return this.createForm.get('soHoChieuKT'); }
  get soHoChieu(): any { return this.createForm.get('soHoChieu'); }
  get hC_NgayCap(): any { return this.createForm.get('hC_NgayCap'); }
  get hC_NgayHL(): any { return this.createForm.get('hC_NgayHL'); }
  get hC_Loai(): any { return this.createForm.get('hC_Loai'); }
  get hC_SoThiThuc(): any { return this.createForm.get('hC_SoThiThuc'); }
  get hC_NgayCapTT(): any { return this.createForm.get('hC_NgayCapTT'); }
  get listFile(): any { return this.createForm.get('listFile'); }
  get fileHoChieu(): any { return this.createForm.get('fileHoChieu'); }
  get strLsFileDelete(): any { return this.createForm.get('strLsFileDelete'); }
  get fileUpList(): any { return this.createForm.get('fileUpList'); }
  get fileHCUp(): any { return this.createForm.get('fileHC'); }

  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = "";
  editFile: boolean = true;
  removeUpload: boolean = false;

  uploadFileIMG(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    fileImg = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(fileImg);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

  state$: Observable<any>;
  constructor(
    private quanLyTVService: QuanLyTVService,
    private passportService: PassportService,
    private route: ActivatedRoute,
    private router: Router,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private cd: ChangeDetectorRef,
    public alert: AlertServiceCheck,
    private hChieuService: HChieuNGService,
    private sanitizer: DomSanitizer,
    private userService: DoanRaService,
    private navbarService: NavBarService,
    private sessionStorageService: SessionStorageService,) {
    this.state$ = this.route.paramMap.pipe(
      map(() => window.history.state),
    )
  }


  ngOnInit(): void {
    dSThanhVienDoan.clear();
    this.passportService
      .query()
      .subscribe({
        next: (res: HttpResponse<Passport[]>) => {
          this.onSuccessHC(res.body, res.headers);
        },
      });
    this.state$.subscribe(result => {
      this.doanRa = result;
      this.userService.getQuocGia(this.doanRa.maDoan == null ? "" : this.doanRa.maDoan.toString()).subscribe((resultQG) => {
        this.qGiaDen = resultQG;
      });
      this.quanLyTVService.getLsTV(this.doanRa.maDoan).subscribe((resultTV) => {
        console.log(resultTV);
        for (let index = 0; index < resultTV.length; index++) {
          if(index == resultTV.length - 1) {
            this.stt = Number(resultTV[resultTV.length - 1].soTT) + 1;
          }
          if(resultTV[index].hcNgoaiGiaoVM.gioiTinh == null) {
            this.gioiTinhLoad = ""
          } else if(resultTV[index].hcNgoaiGiaoVM.gioiTinh == true) {
            this.gioiTinhLoad = "Nam"
          } else {
            this.gioiTinhLoad = "Nữ"
          }
          let tTinTV = new FormGroup({
            soTT: new FormControl(resultTV[index].soTT),
            ckSoTT: new FormControl(resultTV[index].ckSoTT),
            maTV: new FormControl(resultTV[index].maTV),
            maHSDoan: new FormControl(resultTV[index].maHSDoan),
            tenHSDoan: new FormControl(resultTV[index].tenHSDoan),
            coQuan: new FormControl(resultTV[index].coQuan == 'null' ? "" : resultTV[index].coQuan),
            chucVu: new FormControl(resultTV[index].chucVu == 'null' ? "" : resultTV[index].chucVu),
            hoTen: new FormControl(resultTV[index].hoTen),
            gioiTinh: new FormControl(this.gioiTinhLoad),
            ngaySinh: new FormControl(resultTV[index].hcNgoaiGiaoVM.ngaySinh),
            noiLuuTru: new FormControl(resultTV[index].noiLuuTru),
            ngayNC: new FormControl(resultTV[index].ngayNC),
            ngayXC: new FormControl(resultTV[index].ngayXC),
            tangPham: new FormControl(resultTV[index].tangPham),
            soHoChieu: new FormControl(resultTV[index].soHoChieu),
            hC_NgayCap: new FormControl(resultTV[index].hcNgoaiGiaoVM.cmndNgayCap),
            hC_NgayHL: new FormControl(resultTV[index].hC_NgayHL),
            hC_Loai: new FormControl(resultTV[index].hC_Loai),
            hC_SoThiThuc: new FormControl(resultTV[index].hC_SoThiThuc),
            hC_NgayCapTT: new FormControl(resultTV[index].hC_NgayCapTT),
            listFile: new FormControl(resultTV[index].listFile),
            fileHoChieu: new FormControl(resultTV[index].fileHoChieu),
            strLsFileDelete: new FormControl(resultTV[index].strLsFileDelete),
            fileUpList: new FormControl(this.fileList),
            fileHC: new FormControl(fileImg),
            maQG: new FormControl(resultTV[index].maQG),
            quocGia: new FormControl(this.tenQG),
            type: new FormControl(0),
          })
          this.countLisTV++;
          dSThanhVienDoan.push(tTinTV);
        }
      });


    });
    this.totalFileSize = 0;
    this.route.data.subscribe(({ delegationIn }) => {
      if (delegationIn) {
        this.createForm.reset(delegationIn);
      } else {
        // this.createForm.reset(newQuanLyTV);
      }
    });

    this.currentPath = this.router.url;
    console.log(this.currentPath)
    this.navbarService.getSubPath(this.currentPath, 'Thêm mới thành viên');
  }

  private onSuccessHC(dsHC: Passport[] | null, headers: HttpHeaders): void {
    this.passports = dsHC;
  }

  handleFileInput = async (event) => {
    quanLyTVTemp.listFile = event.target.files;
    this.isuploadDocument = false;
    if (quanLyTVTemp.listFile.length > 0) {
      for (let i = 0; i < quanLyTVTemp.listFile.length; i++) {
        this.fileToUpload = quanLyTVTemp.listFile.item(i);
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
              AttachmentContent: await this.readUploadedFileAsDataUrl(quanLyTVTemp.listFile.item(i))
            };
            this.lstUploadedFiles.push(this.fileUploaded);
            this.fileList.push(quanLyTVTemp.listFile[i]);
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
    quanLyTVTemp.listFile = [].slice.call(quanLyTVTemp.listFile).filter(e => e.name !== filename);
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

  @ViewChild('gioiTinh') gioiTinh!: ElementRef;
  selectedTeam = '';
  onSelected() {
    this.selectedTeam = this.gioiTinh.nativeElement.value
    if (this.selectedTeam != "") {
      this.gioiTinhChoose = this.selectedTeam == '1' ? true : false;
    };
  }

  addData() {
    this.tableData.push(this.inputFieldValue);
  }

  getData() {
    let sample_data = ["tiger", "cow", "hyena"];
    this.loadData(sample_data);

  }
  loadData(data) {
    this.tableData = [...this.tableData, ...data];
  }

  handleChange($event) {
    let index = $event.target.selectedIndex - 1;
    console.log(this.qGiaDen[index]);
    this.tenQG = (this.qGiaDen[index].quocGia);
  }

  themTV(): void {
    // var ckSoTT = false;
    // var isThem = true;
    if (this.checkHC == false) {
      this.alert.warn('Bạn cần kiểm tra hộ chiếu trước khi thêm thành viên')
    } else {
      const createFormVM = this.createForm.value;
      if(createFormVM.gioiTinh == null){
        this.gioiTinhSave = "";
      } else if(createFormVM.gioiTinh == '1') {
        this.gioiTinhSave = "Nam";
      } else if(createFormVM.gioiTinh == '0') {
        this.gioiTinhSave = "Nữ";
      }
      if (dSThanhVienDoan.length > 0 && this.isThem == true) {
        for (let i = 0; i < dSThanhVienDoan.length; i++) {
          if (createFormVM.soTT == dSThanhVienDoan.value[i].soTT || this.ckSoTT == true) {
            dSThanhVienDoan.value[i].soTT = (Number(dSThanhVienDoan.value[i].soTT) + 1).toString();
            this.ckSoTT = true;
          }
        }
      }
      if (this.ckSoTT == true) {
        var editBtn = confirm(" Số thứ tự này đã tồn tại bạn có muốn ghi đè?");
        if (editBtn == true) {
          this.isThem = true;
        } else {
          this.isThem = false;
        }
      }

      this.themFlag = true;
      if(this.isThem == true) {
        let tTinTV = new FormGroup({
          soTT: new FormControl(createFormVM.soTT),
          ckSoTT: new FormControl(this.ckSoTT),
          maTV: new FormControl(createFormVM.maTV),
          maHSDoan: new FormControl(createFormVM.maHSDoan),
          tenHSDoan: new FormControl(createFormVM.tenHSDoan),
          coQuan: new FormControl(createFormVM.coQuan),
          chucVu: new FormControl(createFormVM.chucVu),
          hoTen: new FormControl(createFormVM.hoTen),
          gioiTinh: new FormControl(this.gioiTinhSave),
          ngaySinh: new FormControl($('#ngaySinh').first().val()),
          noiLuuTru: new FormControl(createFormVM.noiLuuTru),
          ngayNC: new FormControl($('#ngayNC').first().val()),
          ngayXC: new FormControl($('#ngayXC').first().val()),
          tangPham: new FormControl(createFormVM.tangPham),
          soHoChieu: new FormControl(createFormVM.soHoChieu),
          hC_NgayCap: new FormControl($('#hC_NgayCap').first().val()),
          hC_NgayHL: new FormControl($('#hC_NgayHL').first().val()),
          hC_Loai: new FormControl(createFormVM.hC_Loai),
          hC_SoThiThuc: new FormControl(createFormVM.hC_SoThiThuc),
          hC_NgayCapTT: new FormControl($('#hC_NgayCapTT').first().val()),
          listFile: new FormControl(createFormVM.listFile),
          fileHoChieu: new FormControl(createFormVM.fileHoChieu),
          strLsFileDelete: new FormControl(createFormVM.strLsFileDelete),
          fileUpList: new FormControl(this.fileList),
          fileHC: new FormControl(fileImg),
          maQG: new FormControl(createFormVM.maQG),
          quocGia: new FormControl(this.tenQG),
          type: new FormControl(1)
        })
        dSThanhVienDoan.push(tTinTV);
        //this.alert.success('Thêm mới thành viên đoàn ra thành công!');
        this.sortBy('soTT');
        this.stt = Number(dSThanhVienDoan.value[dSThanhVienDoan.length - 1].soTT) + 1;
        this.clearForm();
        this.checkHC = false;
        this.countThem++;
        this.isThem = true;
        this.ckSoTT = false;
      }
    }
  }

  formatDate(ngay: string) {
    let year = ngay.substring(0, 4);
    let month = ngay.substring(5, 7);
    let day = ngay.substring(8, 10);
    return [day, month, year].join('/');
  }

  formatDateOnField(ngay: string) {
    let year = ngay.substring(6, 10);
    let month = ngay.substring(3, 5);
    let day = ngay.substring(0, 2);
    return [year, month, day].join('-');
  }

  clearForm() {
    this.soHoChieuKT.reset();
    this.maTV.reset();
    this.coQuan.reset();
    this.chucVu.reset();
    this.hoTen.reset();
    this.gioiTinhGet.reset();
    this.ngaySinh.reset();
    this.noiLuuTru.reset();
    this.ngayNC.reset();
    this.ngayXC.reset();
    this.tangPham.reset();
    this.soHoChieu.reset();
    this.hC_NgayCap.reset();
    this.hC_NgayHL.reset();
    this.hC_Loai.reset();
    this.hC_SoThiThuc.reset();
    this.hC_NgayCapTT.reset();
    this.listFile.reset();
    this.fileHoChieu.reset();
    this.strLsFileDelete.reset();
    this.fileUpList.reset();
    this.fileHCUp.reset();
    fileImg = null;
    this.imageUrl = null;
    this.lstUploadedFiles = [];
    this.fileList = [];
    this.imageUrlHC = null;
    console.log(this.maTV.reset())
  }

  get dSThanhVienDoanControls() {
    // a getter!
    return (<FormArray>this.createForm.get('dSThanhVienDoan')).controls;
  }

  deleteRowTV(index: number) {
    var delBtn = confirm(" Bạn có muốn xóa không ?");
    if (delBtn == true) {
      if(this.createForm.get('dSThanhVienDoan').value[index].maTV != null){
        this.countXoa++;
        this.maThanhVien.push(this.createForm.get('dSThanhVienDoan').value[index].maTV);
      }
      (<FormArray>this.createForm.get('dSThanhVienDoan')).removeAt(index);
      this.countLisTV--;
    }
  }

  kiemTra() {
    const soHoChieu = this.createForm.value.soHoChieuKT;
    // this.quanLyTVService.getCurrentDataHC(soHoChieu).subscribe((result) => {
    //     
    // });
    this.quanLyTVService.getCurrentDataHC(soHoChieu).subscribe({
      next: (response) => this.processTTinHC(response), error: response => {
        var checkHCBtn = confirm(" Số hộ chiếu chưa tồn tại, bạn có muốn thêm mới hộ chiếu không? ");
        if (checkHCBtn == true) {
          this.router.navigate(['/HoChieu/quanlyHCNgoaiGiao/newHChieuNG']);
        }
      }
    });

  }

  processTTinHC(response) {
    this.listFileHC = response.body.listHCFileVM;
        this.checkHC = true;
        if(response.body['gioiTinh'] == null){
          this.gioiTinhNum = null;
        } else if(response.body['gioiTinh'] == true) {
          this.gioiTinhNum = "1";
        } else if(response.body['gioiTinh'] == false) {
          this.gioiTinhNum = "0";
        }
        this.createForm = new FormGroup({
          soTT: new FormControl(this.createForm.value.soTT),
          ckSoTT: new FormControl(this.createForm.value.ckSoTT),
          maTV: new FormControl(this.createForm.value.maTV),
          maHSDoan: new FormControl(this.createForm.value.maHSDoan),
          tenHSDoan: new FormControl(this.createForm.value.tenHSDoan),
          coQuan: new FormControl(response.body['coQuan'] =='null' ? "" : response.body['coQuan']),
          chucVu: new FormControl(response.body['chucVu'] == 'null' ? "" : response.body['chucVu']),
          hoTen: new FormControl(response.body['hoTen']),
          gioiTinh: new FormControl(this.gioiTinhNum),
          ngaySinh: new FormControl(response.body['ngaySinh'] == null ? "" : response.body['ngaySinh']),
          noiLuuTru: new FormControl(this.createForm.value.noiLuuTru),
          ngayNC: new FormControl(this.createForm.value.ngayNC),
          ngayXC: new FormControl(this.createForm.value.ngayXC),
          tangPham: new FormControl(this.createForm.value.tangPham),
          soHoChieuKT: new FormControl(this.createForm.value.soHoChieuKT),
          soHoChieu: new FormControl(response.body['soHC']),
          hC_NgayCap: new FormControl(response.body['cmndNgayCap'] == null ? "" : response.body['cmndNgayCap']),
          hC_NgayHL: new FormControl(response.body['cmndNgayHL'] == null ? "" : response.body['cmndNgayHL']),
          hC_Loai: new FormControl(response.body['loaiHC']),
          hC_SoThiThuc: new FormControl(this.createForm.value.hC_SoThiThuc, {
            nonNullable: true,
            validators: [
              Validators.required,
            ],
          }),
          hC_NgayCapTT: new FormControl(this.createForm.value.hC_NgayCapTT, {
            nonNullable: true,
            validators: [
              Validators.required,
            ],
          }),
          maQG: new FormControl(this.createForm.value.maQG),
          quocGia: new FormControl(this.createForm.value.quocGia),
          listFile: new FormControl(this.createForm.value.listFile),
          fileHoChieu: new FormControl(this.createForm.value.fileHoChieu),
          strLsFileDelete: new FormControl(this.createForm.value.strLsFileDelete),
          fileUpList: new FormControl(this.createForm.value.fileUpList),
          fileHC: new FormControl(this.createForm.value.fileHC),
          dSThanhVienDoan: dSThanhVienDoan,
          type: new FormControl(1)
        });
        if (response.body.listHCFileVM.length > 0) {
          for (let i = 0; i < response.body.listHCFileVM.length; i++) {
            if (this.listFileHC[i].type == 0) {
              this.downloadImg(this.listFileHC[i].id);
              this.idAnh = this.listFileHC[i].id;
            }
          }
        }
  }

  downloadFile(id: number, name: string) {
    this.quanLyTVService.downloadFileIMG(id).subscribe((response: any) => {
      let blob:any = new Blob([response], { type: 'application/json; charset=utf-8' });
      // const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, name);
    }), (error: any) => console.log('Error downloading the file');
  }


  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }

  createDV(): void {
    this.isSaving = true;
    for (let index = 0; index < this.dSThanhVienDoanControls.length; index++) {
      let payload = new FormData();
      let createFormMV = this.dSThanhVienDoanControls[index].value;
      if (createFormMV.type == 1) {
        payload.append('soTT', createFormMV.soTT == null ? "" : createFormMV.soTT);
        payload.append('ckSoTT', createFormMV.ckSoTT == true ? "true" : "false");
        payload.append('maTV', createFormMV.maTV == null ? "" : createFormMV.maTV);
        payload.append('maHSDoan', createFormMV.maHSDoan == null ? "" : createFormMV.maHSDoan);
        payload.append('tenHSDoan', createFormMV.tenHSDoan == null ? "" : createFormMV.tenHSDoan);
        payload.append('hoTen', createFormMV.hoTen == null ? "" : createFormMV.hoTen);
        if(createFormMV.gioiTinh == ""){
          this.gioiTinhSave = "";
        } else if(createFormMV.gioiTinh == "Nam") {
          this.gioiTinhSave = "true";
        } else if(createFormMV.gioiTinh == "Nữ") {
          this.gioiTinhSave = "false";
        }
        payload.append('gioiTinh', this.gioiTinhSave);
        payload.append('chucVu', createFormMV.chucVu == null ? "" : createFormMV.chucVu);
        payload.append('coQuan', createFormMV.coQuan == null ? "" : createFormMV.coQuan);
        payload.append('maQG', createFormMV.maQG == null ? "" : createFormMV.maQG);
        payload.append('quocGia', createFormMV.quocGia == null ? "" : createFormMV.quocGia);
        payload.append('NgaySinh', createFormMV.ngaySinh == null ? "" : createFormMV.ngaySinh);
        payload.append('noiLuuTru', createFormMV.noiLuuTru == null ? "" : createFormMV.noiLuuTru);
        payload.append('ngayNC', $('#ngayNC'+index).first().val());
        payload.append('ngayXC', $('#ngayXC'+index).first().val());
        payload.append('tinhTrangSK', createFormMV.tinhTrangSK == null ? "" : createFormMV.tinhTrangSK);
        payload.append('tangPham', createFormMV.tangPham == null ? "" : createFormMV.tangPham);
        payload.append('soHoChieu', createFormMV.soHoChieu == null ? "" : createFormMV.soHoChieu);
        payload.append('CMNDNgayCap', createFormMV.hC_NgayCap == null ? "" : createFormMV.hC_NgayCap);
        payload.append('CMNDNgayHL', createFormMV.hC_NgayHL == null ? "" : createFormMV.hC_NgayHL);
        payload.append('LoaiHC', createFormMV.hC_Loai == null ? "" : createFormMV.hC_Loai);
        payload.append('SoThiThuc', createFormMV.hC_SoThiThuc == null ? "" : createFormMV.hC_SoThiThuc);
        payload.append('NgayCapTT', createFormMV.hC_NgayCapTT == null ? "" : createFormMV.hC_NgayCapTT);
        payload.append('createdBy', this.userName)
        if (createFormMV.fileUpList.length > 0) {
          for (let i = 0; i < createFormMV.fileUpList.length; i++) {
            console.log('filetesst' + createFormMV.fileUpList[i]);
            // this.selectedFile = this.lstUploadedFiles[i];
            // console.log('lưu' + this.lstUploadedFiles[i]);
            payload.append('listFile', createFormMV.fileUpList[i]);
            // payload.append('addressProofDoc', this.selectedFile[i]);
          }
        }
        if (createFormMV.fileHC != null) {
          payload.append('listFile', createFormMV.fileHC)
          payload.append('fileHoChieu', createFormMV.fileHC.name)
        }
        console.log(payload.getAll('listFile'));
        if (createFormMV.hoTen !== null) {
          this.quanLyTVService.create(payload).subscribe({
            next: (response) => {
              if (this.countThem > 0) {
                this.countThem--;
                if (this.countThem == 0) {
                  this.themFlag = true;
                }
              }
                
              if ((this.countThem == 0 && this.themFlag == true) || (this.countXoa == 0 && this.xoaFlag == true)) {
                this.alert.success('Thêm mới thành công thành viên');
                this.redirectTo('/doanRa/quanLyTVRa');
              }
            },
            error: response => this.themError(response)
          });
        }
      }
    }
    if(this.maThanhVien.length > 0) {
      for(let maTV of this.maThanhVien)
      this.quanLyTVService.delete(maTV).subscribe({
        next: (response) => {
          if(this.countXoa > 0){
            this.countXoa--;
            if(this.countXoa == 0 && this.themFlag == false) {
              this.xoaFlag = true;
              this.alert.success('Xóa thành công');
              this.redirectTo('/doanRa/quanLyTVRa');
            } else if (this.countXoa == 0 && this.themFlag == true) {
              this.xoaFlag = true;
              this.alert.success('Thêm thành công');
              this.redirectTo('/doanRa/quanLyTVRa');
            }
          }
        }
          , error: response => this.themError(response)
      });
    }
  }

  themSuccess(response) {
    if(this.countThem > 0)
      this.countThem--;
    if(this.countXoa > 0)
      this.countXoa--;
    if (this.countThem == 0 || this.countXoa == 0) {
      this.alert.success('Thêm mới thành công thành viên');
      this.redirectTo('/doanRa/quanLyTVRa');
    } 
  }

  themError(response: HttpErrorResponse) {
    if (response.status != 400 && (this.countThem != 0 || this.countXoa != 0)) {
      this.alert.warn(" Thêm mới thành viên không thành công! ");
    }
  }

  imageUrlHC: any;
  downloadImg(id: number) {
    this.hChieuService.downloadFile(id).subscribe((data: Blob) => {
      let objectURL = URL.createObjectURL(data);
      this.imageUrlHC = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }), (error: any) => console.log('Error downloading the file');
  }

  checkDateNgayNC(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày nhập cảnh theo định dạng DD/MM/YYYY")
      $('#ngayNC').focus()
    }
  }

  checkDateNgayXC(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày xuất cảnh theo định dạng DD/MM/YYYY")
      $('#ngayXC').focus()
    }
  }

  checkDateNgayNCList(event, i) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày nhập cảnh theo định dạng DD/MM/YYYY")
      $('#ngayNC'+i).focus()
    }
  }

  checkDateNgayXCList(event,i) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày xuất cảnh theo định dạng DD/MM/YYYY")
      $('#ngayXC'+i).focus()
    }
  }

  isInvalidDateNgayNC($event) {
    this.ngayNCModel = $event;
      if (this.ngayNCModel != null && this.ngayXCModel != null) {
        if (this.ngayNCModel < this.ngayXCModel) {
          $('#ngayNC').val(null)
          this.alert.warn("Vui lòng nhập Ngày nhập cảnh lớn hơn Ngày xuất cảnh")
          $('#ngayNC').focus()
        } else {
          this.showEditable = true;
        }
      }
  }

  isInvalidDateNgayXC($event) {
    this.ngayXCModel = $event;
      if (this.ngayNCModel != null && this.ngayXCModel != null) {
        if (this.ngayNCModel < this.ngayXCModel) {
          $('#ngayXC').val(null)
          this.alert.warn("Vui lòng nhập Ngày xuất cảnh nhỏ hơn Ngày nhập cảnh")
          $('#ngayXC').focus()
        } else {
          this.showEditable = true;
        }
      }
  }

  isInvalidDateNgayNCList(event, i) {
    this.ngayNCModel = event;
      if (this.ngayNCModel != null && this.ngayXCModel != null) {
        if (this.ngayNCModel < this.ngayXCModel) {
          $('#ngayNC'+i).val(null)
          this.alert.warn("Vui lòng nhập Ngày nhập cảnh lớn hơn Ngày xuất cảnh")
          $('#ngayNC'+i).focus()
        } else {
          this.showEditable = true;
        }
      }
  }

  isInvalidDateNgayXCList(event, i) {
    this.ngayXCModel = event;
      if (this.ngayNCModel != null && this.ngayXCModel != null) {
        if (this.ngayNCModel < this.ngayXCModel) {
          $('#ngayXC'+i).val(null)
          this.alert.warn("Vui lòng nhập Ngày xuất cảnh nhỏ hơn Ngày nhập cảnh")
          $('#ngayXC'+i).focus()
        } else {
          this.showEditable = true;
        }
      }
  }

  isInvalidDateNgaySinh(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày sinh theo định dạng DD/MM/YYYY")
      $('#ngaySinh').focus()
    }
  }

  checkDateNgaySinh(event) {
    let ngaySinh = event;
    if (ngaySinh >= new Date()) {
      this.alert.warn("Ngày sinh phải nhỏ hơn ngày hiện tại")
      $('#ngaySinh').focus()
    }
  }

  isInvalidDateNgayCap(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày cấp hộ chiếu theo định dạng DD/MM/YYYY")
      $('#hC_NgayCap').focus()
    }
  }

  checkDateNgayCap(event) {
    this.ngayCap = event;
    if(this.ngayCap != null && this.ngayHL != null) {
      if(this.ngayCap > this.ngayHL) {
        this.alert.warn("Ngày cấp không được lớn hơn ngày hết hạn")
        $('#hC_NgayCap').focus()
      }
    }
  }

  isInvalidDateNgayCapTT(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày cấp thị thực theo định dạng DD/MM/YYYY")
      $('#hC_NgayCapTT').focus()
    }
  }

  checkDateNgayCapTT(event) {
    let ngayCapTT = event;
    if (ngayCapTT >= new Date()) {
      this.alert.warn("Ngày cấp thị thực phải nhỏ hơn ngày hiện tại")
      $('#hC_NgayCapTT').focus()
    }
  }

  isInvalidDateNgayHL(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày hết hạn theo định dạng DD/MM/YYYY")
      $('#hC_NgayHL').focus()
    }
  }

  checkDateNgayHL(event) {
    this.ngayHL = event;
    if(this.ngayCap != null && this.ngayHL != null) {
      if(this.ngayCap > this.ngayHL) {
        this.alert.warn("Ngày hết hạn không được nhỏ hơn ngày cấp")
        $('#hC_NgayHL').focus()
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

  sortBy(FieldName: string) {
    console.log(dSThanhVienDoan.value, FieldName);
    dSThanhVienDoan.setValue(dSThanhVienDoan.value.sort((a, b) => a[FieldName] - b[FieldName]))

  }
}
