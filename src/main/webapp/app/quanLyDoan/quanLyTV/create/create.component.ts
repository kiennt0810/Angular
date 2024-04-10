import { ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IQuanLyTV, QuanLyTV } from '../quanLyTV.model';
import { QuanLyTVService } from '../service/quanLyTV.service';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IFileUploadVM } from 'app/quanLyDoan/file.model';
import { AlertService } from 'app/core/util/alert.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DelegationIn } from 'app/quanLyDoan/quanLyDoanVao/doanVao.model';
import moment from 'moment';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { Passport } from 'app/quanlydanhmuc/loaihochieu/loaihochieu.model';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { SessionStorageService } from 'ngx-webstorage';
import {MatInputModule} from '@angular/material/input';
import { CategoriesManagementService } from 'app/quanLyDoan/quanLyDoanVao/service/categories-management.service';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { ASC, DESC } from 'app/config/navigation.constants';

// import { AlertServiceCheck } from 'app/alert/alertNew.service';

const quanLyTVTemp = {} as IQuanLyTV;
const fileUploadVM = {} as IFileUploadVM;
const listDVFileVM = new FormArray([]);
const dSThanhVienDoan = new FormArray([]);
let fileImg = null;

const newQuanLyTV: IQuanLyTV = {

} as IQuanLyTV;



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
  
})

export class CreateComponent implements OnInit {
  checkSoHC: number;
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
  gioiTinhSave: string;
  gioiTinhLoad: any;
  inputFieldValue;
  tableData: any[] = [];
  success = false;
  errorPassportExists = false;
  error = false;
  doanVao: DelegationIn | null = null;
  citems: User[] | null = null;
  passports: Passport[] | null = null;
  qGSelect: string;
  tTinHC: any;
  countLisTV = 0;
  countThem = 0;
  countXoa = 0;
  checkNameFile = true;
  nameFile: string[] = [];
  ngayNCModel: any;
  ngayXCModel: any;
  maThanhVien: string[] = [];
  maDoan: string;
  ngayHL: any;
  ngayCap: any;
  isWarningNS = false;
  isWarningNC =  false;
  isWarningHL =  false;
  isWarningNCTT =  false;
  isWarningNNC =  false;
  isWarningNXC = false;
  isWarningHoten = false;
  xoaFlag =false;
  themFlag=false;
  currentPath: string;
  stt = 1;

  totalItems = 0;
  itemsPerPage = 5;
  page!: number;
  pageSize!: number;
  isLoading = false;
  totalPages: number;
  predicate!: string;
  ascending!: boolean;
  isThem = true
  ckSoTT = false
  createForm = new FormGroup({
    soTT: new FormControl(quanLyTVTemp.soTT),
    ckSoTT: new FormControl(quanLyTVTemp.ckSoTT),
    maTV: new FormControl(quanLyTVTemp.maTV),
    maHSDoan: new FormControl(quanLyTVTemp.maHSDoan),
    tenHSDoan: new FormControl(quanLyTVTemp.tenHSDoan),
    coQuan: new FormControl(quanLyTVTemp.coQuan),
    chucVu: new FormControl(quanLyTVTemp.chucVu),
    hoTen: new FormControl(quanLyTVTemp.hoTen, {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    hoTenPA: new FormControl(quanLyTVTemp.hoTenPA),
    gioiTinh: new FormControl(quanLyTVTemp.gioiTinh),
    ngaySinh: new FormControl(quanLyTVTemp.ngaySinh),
    maQG: new FormControl(quanLyTVTemp.maQG, {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    quocGia: new FormControl(quanLyTVTemp.quocGia),
    noiLuuTru: new FormControl(quanLyTVTemp.noiLuuTru),
    ngayNC: new FormControl(quanLyTVTemp.ngayNC),
    ngayXC: new FormControl(quanLyTVTemp.ngayXC),
    tinhTrangSK: new FormControl(quanLyTVTemp.tinhTrangSK),
    tangPham: new FormControl(quanLyTVTemp.tangPham),
    soHoChieu: new FormControl(quanLyTVTemp.soHoChieu),
    hC_NgayCap: new FormControl(quanLyTVTemp.hC_NgayCap),
    hC_NgayHL: new FormControl(quanLyTVTemp.hC_NgayHL),
    hC_Loai: new FormControl(quanLyTVTemp.hC_Loai),
    hC_SoThiThuc: new FormControl(quanLyTVTemp.hC_SoThiThuc),
    hC_NgayCapTT: new FormControl(quanLyTVTemp.hC_NgayCapTT),
    listFile: new FormControl(quanLyTVTemp.listFile),
    fileHoChieu: new FormControl(quanLyTVTemp.fileHoChieu),
    strLsFileDelete: new FormControl(quanLyTVTemp.strLsFileDelete),
    fileUpList: new FormControl(quanLyTVTemp.fileUpList),
    fileHC: new FormControl(quanLyTVTemp.fileHC),
    dSThanhVienDoan: dSThanhVienDoan,
    type: new FormControl(),
    createdBy: new FormControl(quanLyTVTemp.createdBy)
  });
  get maTV(): any { return this.createForm.get('maTV'); }
  get coQuan(): any { return this.createForm.get('coQuan'); }
  get chucVu(): any { return this.createForm.get('chucVu'); }
  get hoTen(): any { return this.createForm.get('hoTen'); }
  get hoTenPA(): any { return this.createForm.get('hoTenPA'); }
  get gioiTinhGet(): any { return this.createForm.get('gioiTinh'); }
  get ngaySinh(): any { return this.createForm.get('ngaySinh'); }
  get maQG(): any { return this.createForm.get('maQG'); }
  get quocGia(): any { return this.createForm.get('quocGia'); }
  get noiLuuTru(): any { return this.createForm.get('noiLuuTru'); }
  get ngayNC(): any { return this.createForm.get('ngayNC'); }
  get ngayXC(): any { return this.createForm.get('ngayXC'); }
  get tinhTrangSK(): any { return this.createForm.get('tinhTrangSK'); }
  get tangPham(): any { return this.createForm.get('tangPham'); }
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

  @ViewChild('myDiv', {static: true}) myDiv: ElementRef;
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
  constructor(
    private quanLyTVService: QuanLyTVService,
    private qGService: QuocgiavavunglanhthoService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    public alert: AlertServiceCheck,
    private doanVaoService: CategoriesManagementService,
    private sessionStorageService: SessionStorageService,
    private navbarService: NavBarService) {
    
  }

  ngOnInit(): void {
    dSThanhVienDoan.clear()

    this.maDoan = sessionStorage.getItem('currentMaDoan');
    console.log(this.maDoan)
      this.doanVaoService.getCurrentData(this.maDoan).subscribe(data => {
        this.doanVao = data;
      })   

      this.handleNavigation();

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
        // this.createForm.reset(newQuanLyTV);
      }
    });
    // this.quanLyTVService.authorities().subscribe(authorities => (this.authorities = authorities));

    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Thêm mới thành viên');
  }

  private onSuccessQG(qG: User[] | null, headers: HttpHeaders): void {
    this.citems = qG;
  }

  private onSuccessHC(dsHC: Passport[] | null, headers: HttpHeaders): void {
    this.passports = dsHC;
  }

  loadAllTv(): void {
    

    this.quanLyTVService
      .getLsTV(
        this.maDoan,
        {
          page: this.page - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        }
      )
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res) {
            let resultTV = res.body;
            for (let index = 0; index < resultTV.length; index++) {
              if(resultTV[index].gioiTinh == null) {
                this.gioiTinhLoad = ""
              } else if(resultTV[index].gioiTinh == true) {
                this.gioiTinhLoad = "Nam"
              } else {
                this.gioiTinhLoad = "Nữ"
              }
              if(index == resultTV.length - 1) {
                this.stt = Number(resultTV[resultTV.length - 1].soTT) + 1;
              }
              let tTinTV = new FormGroup({
                soTT: new FormControl(resultTV[index].soTT),
                ckSoTT: new FormControl(resultTV[index].ckSoTT),
                maTV: new FormControl(resultTV[index].maTV),
                maHSDoan: new FormControl(resultTV[index].maHSDoan),
                tenHSDoan: new FormControl(resultTV[index].tenHSDoan),
                coQuan: new FormControl(resultTV[index].coQuan),
                chucVu: new FormControl(resultTV[index].chucVu),
                hoTen: new FormControl(resultTV[index].hoTen, {
                  nonNullable: true,
                  validators: [
                    Validators.required,
                  ],
                }),
                hoTenPA: new FormControl(resultTV[index].hoTenPA),
                gioiTinh: new FormControl(this.gioiTinhLoad),
                ngaySinh: new FormControl(resultTV[index].ngaySinh),
                maQG: new FormControl(resultTV[index].maQG),
                quocGia: new FormControl(resultTV[index].quocGia),
                noiLuuTru: new FormControl(resultTV[index].noiLuuTru),
                ngayNC: new FormControl(resultTV[index].ngayNC),
                ngayXC: new FormControl(resultTV[index].ngayXC),
                tinhTrangSK: new FormControl(resultTV[index].tinhTrangSK),
                tangPham: new FormControl(resultTV[index].tangPham),
                soHoChieu: new FormControl(resultTV[index].soHoChieu),
                hC_NgayCap: new FormControl(resultTV[index].hC_NgayCap),
                hC_NgayHL: new FormControl(resultTV[index].hC_NgayHL),
                hC_Loai: new FormControl(resultTV[index].hC_Loai),
                hC_SoThiThuc: new FormControl(resultTV[index].hC_SoThiThuc),
                hC_NgayCapTT: new FormControl(resultTV[index].hC_NgayCapTT),
                listFile: new FormControl(resultTV[index].listFile),
                fileHoChieu: new FormControl(resultTV[index].fileHoChieu),
                strLsFileDelete: new FormControl(resultTV[index].strLsFileDelete),
                fileUpList: new FormControl(this.fileList),
                fileHC: new FormControl(fileImg),
                type: new FormControl(0),
                createdBy: new FormControl()
              })
              this.countLisTV++;
              this.onSuccessTV(this.countLisTV);
              dSThanhVienDoan.push(tTinTV);
            }
          }
        },
        error: () =>  (this.isLoading = false)
      });
  }
 

  transition(): void {
    console.log(this.page);
    this.router.navigate([`${this.router.url}`], {
      relativeTo: this.route.parent,
      queryParams: {
        page: this.page,
        sort: `${this.predicate},${this.ascending ? ASC : DESC}`,
      },
    });
  }
  private sort(): string[] {
    const result = [`${this.predicate},${this.ascending ? ASC : DESC}`];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  private onSuccessTV(res): void {
    this.totalItems = Number(res);
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
  }

  private handleNavigation(): void {
    const page = this.page;
    this.page = +(page ?? 1);
    this.loadAllTv();
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
        reject(this.alert.error('Không thể tải file'));
      };
      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsDataURL(inputFile);
    });
  }

  @ViewChild('gioiTinh') gioiTinh!: ElementRef;
  selectedTeam = '';
  // onSelected() {
  //   this.selectedTeam = this.gioiTinh.nativeElement.value
  //   if (this.selectedTeam != "") {
  //     this.gioiTinhChoose = this.selectedTeam == 'true' ? true : false;
  //   };
  // }

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

  themTV(): void {
    // var ckSoTT = false;
    // var isThem = true;
    this.isThem = true;
    const createFormVM = this.createForm.value;
    // if(this.gioiTinhChoose == null){
    //   createFormVM.gioiTinh = "null";
    // } else if(this.gioiTinhChoose == true) {
    //   createFormVM.gioiTinh = "true";
    // } else if(this.gioiTinhChoose == false) {
    //   createFormVM.gioiTinh = "false";
    // }
    if (dSThanhVienDoan.length > 0 && this.isThem == true) {
      let STT = dSThanhVienDoan.value.map(item => item.soTT)
      let sttTrung = STT.find(item => item == createFormVM.soTT)
      if (sttTrung) {
        this.ckSoTT = true;
        if (this.ckSoTT == true) {
          var editBtn = confirm(" Số thứ tự này đã tồn tại bạn có muốn ghi đè?");
          if (editBtn == true) {
            let index = STT.indexOf(sttTrung)
            dSThanhVienDoan.value[index].soTT = (Number(dSThanhVienDoan.value[index].soTT) + 1).toString();
            this.isThem = true;
            
          } else {
            this.isThem = false;
          }
        }
      }
      // for (let i = 0; i < dSThanhVienDoan.length; i++) {
      //   if (createFormVM.soTT == dSThanhVienDoan.value[i].soTT || this.ckSoTT == true) {
      //     dSThanhVienDoan.value[i].soTT = (Number(dSThanhVienDoan.value[i].soTT) + 1).toString();
      //     this.ckSoTT = true;
      //   }
      // }
    }
    this.themFlag = true;
    if (this.isThem == true) {
      let tTinTV = new FormGroup({
        soTT: new FormControl(createFormVM.soTT),
        ckSoTT: new FormControl(this.ckSoTT),
        maTV: new FormControl(createFormVM.maTV),
        maHSDoan: new FormControl(createFormVM.maHSDoan),
        tenHSDoan: new FormControl(createFormVM.tenHSDoan),
        coQuan: new FormControl(createFormVM.coQuan),
        chucVu: new FormControl(createFormVM.chucVu),
        hoTen: new FormControl(createFormVM.hoTen, {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        }),
        hoTenPA: new FormControl(createFormVM.hoTenPA),
        gioiTinh: new FormControl(createFormVM.gioiTinh),
        ngaySinh: new FormControl($('#ngaySinh').first().val()),
        maQG: new FormControl(createFormVM.maQG, {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        }),
        quocGia: new FormControl(createFormVM.quocGia),
        noiLuuTru: new FormControl(createFormVM.noiLuuTru),
        ngayNC: new FormControl($('#ngayNC').first().val()),
        ngayXC: new FormControl($('#ngayXC').first().val()),
        tinhTrangSK: new FormControl(createFormVM.tinhTrangSK),
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
        type: new FormControl(1),
        createdBy: new FormControl()
      })
      this.countLisTV++;
      this.countThem++;
      dSThanhVienDoan.push(tTinTV);
      this.onSuccessTV(this.countLisTV)
      this.mySortingMethod()
      let data = dSThanhVienDoan.value.map(item => item.soTT);
      let soTTMax = data.reduce(function (max, current) { 
        return (max > current) ? max : current;
      })
      this.stt = Number(soTTMax) + 1;
      this.clearForm();
      this.ckSoTT = false;
      this.isThem = true;
    }
  }

  clearForm() {
    this.maTV.reset();
    this.coQuan.reset();
    this.chucVu.reset();
    this.hoTen.reset();
    this.hoTenPA.reset();
    this.gioiTinhGet.reset();
    this.ngaySinh.reset();
    this.maQG.reset();
    this.quocGia.reset();
    this.noiLuuTru.reset();
    this.ngayNC.reset();
    this.ngayXC.reset();
    this.tinhTrangSK.reset();
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
    this.imageUrl = "";
    this.lstUploadedFiles = [];
    this.fileList = [];
  }

  get dSThanhVienDoanControls() {
    // a getter!
    return (<FormArray>this.createForm.get('dSThanhVienDoan')).controls;
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }

async  createDV(): Promise<void> {

    this.isSaving = true;
    
    if (this.dSThanhVienDoanControls.length != this.countLisTV) {
      this.alert.warn("Danh sách thành viên không khớp với số lượng thành viên của đoàn");
    } else {
      for (let index = 0; index < this.dSThanhVienDoanControls.length; index++) {
        const payload = new FormData();
        const createForm = this.dSThanhVienDoanControls[index].value;
        let userName: string = JSON.parse(sessionStorage.getItem('jhi-userName'))
        if (createForm.type == 1) {
          if (createForm.hoTen == "") {
            this.alert.warn('Họ tên không được để trống')
            $('#hoTen1' + index).focus()
            this.isWarningHoten = true;
          } else {
            payload.append('soTT', createForm.soTT == null ? "" : createForm.soTT);
            payload.append('ckSoTT', createForm.ckSoTT == true ? "true" : "false");
            payload.append('maTV', createForm.maTV == null ? "" : createForm.maTV.trim());
            payload.append('maHSDoan', createForm.maHSDoan == null ? "" : createForm.maHSDoan.trim());
            payload.append('tenHSDoan', createForm.tenHSDoan == null ? "" : createForm.tenHSDoan.trim());
            payload.append('coQuan', createForm.coQuan == null ? "" : createForm.coQuan.trim());
            payload.append('chucVu', createForm.chucVu == null ? "" : createForm.chucVu.trim());
            payload.append('hoTen', createForm.hoTen.trim());
            payload.append('hoTenPA', createForm.hoTenPA == null ? "" : createForm.hoTenPA.trim());
            if (createForm.gioiTinh == null) {
              this.gioiTinhSave = "";
            } else if (createForm.gioiTinh == true) {
              this.gioiTinhSave = "true";
            } else if (createForm.gioiTinh == false) {
              this.gioiTinhSave = "false";
            }
            payload.append('gioiTinh', this.gioiTinhSave);
            payload.append('ngaySinh', $('#ngaySinh' + index).first().val() == null ? "" : $('#ngaySinh' + index).first().val());
            payload.append('maQG', createForm.maQG == null ? "" : createForm.maQG.trim());
            payload.append('quocGia', createForm.quocGia == null ? "" : createForm.quocGia.trim());
            payload.append('noiLuuTru', createForm.noiLuuTru == null ? "" : createForm.noiLuuTru.trim());
            payload.append('ngayNC', $('#ngayNC' + index).first().val() == null ? "" : $('#ngayNC' + index).first().val());
            payload.append('ngayXC', $('#ngayXC' + index).first().val() == null ? "" : $('#ngayXC' + index).first().val());
            payload.append('tinhTrangSK', createForm.tinhTrangSK == null ? "" : createForm.tinhTrangSK.trim());
            payload.append('tangPham', createForm.tangPham == null ? "" : createForm.tangPham.trim());
            payload.append('soHoChieu', createForm.soHoChieu == null ? "" : createForm.soHoChieu.trim());
            payload.append('hC_NgayCap', $('#hC_NgayCap' + index).first().val() == null ? "" : $('#hC_NgayCap' + index).first().val());
            payload.append('hC_NgayHL', $('#hC_NgayHL' + index).first().val() == null ? "" : $('#hC_NgayHL' + index).first().val());
            payload.append('hC_Loai', createForm.hC_Loai == null ? "" : createForm.hC_Loai.trim());
            payload.append('hC_SoThiThuc', createForm.hC_SoThiThuc == null ? "" : createForm.hC_SoThiThuc.trim());
            payload.append('hC_NgayCapTT', $('#hC_NgayCapTT' + index).first().val() == null ? "" : $('#hC_NgayCapTT' + index).first().val());
            payload.append('createdBy', userName)
            this.isWarningHoten = false;

            if (createForm.fileUpList.length > 0) {
              for (let i = 0; i < createForm.fileUpList.length; i++) {
                // this.selectedFile = this.lstUploadedFiles[i];
                // console.log('lưu' + this.lstUploadedFiles[i]);
                payload.append('listFile', createForm.fileUpList[i]);
                // payload.append('addressProofDoc', this.selectedFile[i]);
              }
            }
            if (createForm.fileHC != null && createForm.fileHC != "") {
              payload.append('listFile', createForm.fileHC)
              payload.append('fileHoChieu', createForm.fileHC.name)
            }
          }
           if (createForm.hoTen !== null) {
              this.quanLyTVService.create(payload).subscribe({
               next: (response) => {
                if(this.countThem > 0){
                  this.countThem--;
                  if(this.countThem == 0) {
                    this.themFlag = true;
                  }
                }
                  
                if ((this.countThem == 0 && this.themFlag ==true) || (this.countXoa == 0 && this.xoaFlag == true)) {
                  this.alert.success('Thêm mới thành công thành viên');
                  this.redirectTo('/doanVao/quanLyTV');
              } 
               }, error: response => this.themError(response)
              });
          }
        }
      }
      console.log(this.themFlag)
      if(this.maThanhVien.length > 0) {
        for(let maTV of this.maThanhVien)
        this.quanLyTVService.delete(maTV).subscribe({
          next: (response) => {
            if(this.countXoa > 0){
              this.countXoa--;
              if(this.countXoa == 0 && this.themFlag == false) {
                this.xoaFlag = true;
                this.alert.success('Xóa thành công');
                this.redirectTo('/doanVao/quanLyTV');
              } else if (this.countXoa == 0 && this.themFlag == true) {
                this.xoaFlag = true;
                this.alert.success('Thêm thành công');
                this.redirectTo('/doanVao/quanLyTV');
              }
            }
          }, error: response => {
            this.xoaFlag = false;
          }
        });
      }
    }
  }


   sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

  themError(response: HttpErrorResponse) {
    if (this.isWarningHoten = true) {
      return;
    } else {
      if (response.status != 400 && (this.countThem != 0 || this.countXoa != 0)) {
        this.alert.warn(" Thêm mới thành viên không thành công! ");
      }
    }
  }

  deleteRowTV(index: number) {
    var delBtn = confirm(" Bạn có muốn xóa không ?");
    if (delBtn == true) {
      (<FormArray>this.createForm.get('dSThanhVienDoan')).removeAt(index);
    }
  }

  kiemTraHC() {
    const soHoChieu = this.createForm.value.soHoChieu;
    this.quanLyTVService.kTraHC(soHoChieu).subscribe({
      next: (response) => this.processTTinHC(response), error: response => {
        this.alert.warn(" Số hộ chiếu chưa tồn tại! ");
        this.createForm = new FormGroup({
          soTT: new FormControl(),
          ckSoTT: new FormControl(),
          maTV: new FormControl(),
          maHSDoan: new FormControl(this.createForm.value.maHSDoan),
          tenHSDoan: new FormControl(this.createForm.value.tenHSDoan),
          coQuan: new FormControl(),
          chucVu: new FormControl(),
          hoTen: new FormControl(null, {
            nonNullable: true,
            validators: [
              Validators.required,
            ],
        }),
          hoTenPA: new FormControl(),
          gioiTinh: new FormControl(),
          ngaySinh: new FormControl(),
          maQG: new FormControl(null, {
            nonNullable: true,
            validators: [
              Validators.required,
            ],
        }),
          quocGia: new FormControl(),
          noiLuuTru: new FormControl(),
          ngayNC: new FormControl(),
          ngayXC: new FormControl(),
          tinhTrangSK: new FormControl(),
          tangPham: new FormControl(quanLyTVTemp.tangPham),
          soHoChieu: new FormControl(),
          hC_NgayCap: new FormControl(),
          hC_NgayHL: new FormControl(),
          hC_Loai: new FormControl(),
          hC_SoThiThuc: new FormControl(),
          hC_NgayCapTT: new FormControl(),
          listFile: new FormControl(quanLyTVTemp.listFile),
          fileHoChieu: new FormControl(quanLyTVTemp.fileHoChieu),
          strLsFileDelete: new FormControl(quanLyTVTemp.strLsFileDelete),
          fileUpList: new FormControl(quanLyTVTemp.fileUpList),
          fileHC: new FormControl(quanLyTVTemp.fileHC),
          dSThanhVienDoan: dSThanhVienDoan,
          type: new FormControl(1),
          createdBy: new FormControl(quanLyTVTemp.createdBy)
        });
      }
    });
  }

  processTTinHC(response) {
    this.tTinHC = response.body;
    this.createForm = new FormGroup({
      soTT: new FormControl(quanLyTVTemp.soTT),
      ckSoTT: new FormControl(quanLyTVTemp.ckSoTT),
      maTV: new FormControl(this.tTinHC.maTV),
      maHSDoan: new FormControl(this.createForm.value.maHSDoan),
      tenHSDoan: new FormControl(this.createForm.value.tenHSDoan),
      coQuan: new FormControl(this.tTinHC.coQuan),
      chucVu: new FormControl(this.tTinHC.chucVu),
      hoTen: new FormControl(this.tTinHC.hoTen),
      hoTenPA: new FormControl(this.tTinHC.hoTenPA),
      gioiTinh: new FormControl(this.tTinHC.gioiTinh),
      ngaySinh: new FormControl(this.tTinHC.ngaySinh),
      maQG: new FormControl(this.tTinHC.maQG),
      quocGia: new FormControl(this.tTinHC.quocGia),
      noiLuuTru: new FormControl(this.tTinHC.noiLuuTru),
      ngayNC: new FormControl(this.tTinHC.ngayNC),
      ngayXC: new FormControl(this.tTinHC.ngayXC),
      tinhTrangSK: new FormControl(this.tTinHC.tinhTrangSK),
      tangPham: new FormControl(this.tTinHC.tangPham),
      soHoChieu: new FormControl(this.tTinHC.soHoChieu),
      hC_NgayCap: new FormControl(this.tTinHC.hC_NgayCap),
      hC_NgayHL: new FormControl(this.tTinHC.hC_NgayHL),
      hC_Loai: new FormControl(this.tTinHC.hC_Loai),
      hC_SoThiThuc: new FormControl(this.tTinHC.hC_SoThiThuc),
      hC_NgayCapTT: new FormControl(this.tTinHC.hC_NgayCapTT),
      listFile: new FormControl(quanLyTVTemp.listFile),
      fileHoChieu: new FormControl(quanLyTVTemp.fileHoChieu),
      strLsFileDelete: new FormControl(quanLyTVTemp.strLsFileDelete),
      fileUpList: new FormControl(quanLyTVTemp.fileUpList),
      fileHC: new FormControl(quanLyTVTemp.fileHC),
      dSThanhVienDoan: dSThanhVienDoan,
      type: new FormControl(1),
      createdBy: new FormControl(quanLyTVTemp.createdBy)
    });
  }

  handleChange($event) {
    let index = $event.target.selectedIndex - 1;
    if (index > 0) {
      this.qGSelect = this.citems[index].ten;
    }
  }

  deleteRowLsTV(index: number) {
    var delBtn = confirm(" Bạn có muốn xóa không ?");
    if (delBtn == true) {
      this.countXoa++;
      this.maThanhVien.push(this.createForm.get('dSThanhVienDoan').value[index].maTV);
      (<FormArray>this.createForm.get('dSThanhVienDoan')).removeAt(index);
      this.countLisTV--;
      this.onSuccessTV(this.countLisTV)
    }
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
        if (this.ngayNCModel > this.ngayXCModel) {
          $('#ngayNC').val(null)
          this.alert.warn("Vui lòng nhập Ngày nhập cảnh nhỏ hơn Ngày xuất cảnh")
          $('#ngayNC').focus()
          this.isWarningNNC = true;
        } else {
          this.isWarningNNC = false;
          this.showEditable = true;
        }
    }
    if (this.ngayNCModel == null) {
      this.isWarningNNC = false;
      this.isWarningNXC = false;
    }

  }

  isInvalidDateNgayXC($event) {
    this.ngayXCModel = $event;
      if (this.ngayNCModel != null && this.ngayXCModel != null) {
        if (this.ngayNCModel > this.ngayXCModel) {
          $('#ngayXC').val(null)
          this.alert.warn("Vui lòng nhập Ngày xuất cảnh lớn hơn Ngày nhập cảnh")
          $('#ngayXC').focus()
          this.isWarningNXC = true;
        } else {
          this.showEditable = true;
          this.isWarningNXC = false;
        }
    }
    if (this.ngayXCModel == null) {
      this.isWarningNXC = false; 
      this.isWarningNNC = false;
    }


  }

  isInvalidDateNgayNCList(event, i) {
    this.ngayNCModel = event;
      if (this.ngayNCModel != null && this.ngayXCModel != null) {
        if (this.ngayNCModel > this.ngayXCModel) {
          $('#ngayNC'+i).val(null)
          this.alert.warn("Vui lòng nhập Ngày nhập cảnh lớn hơn Ngày xuất cảnh")
          $('#ngayNC'+i).focus()
          this.isWarningNNC = true;
        } else {
          this.isWarningNNC = false;
          this.showEditable = true;
        }
    }
    if (this.ngayNCModel == null) {
      this.isWarningNNC = false;
      this.isWarningNXC = false;
    }
  }

  isInvalidDateNgayXCList(event, i) {
    this.ngayXCModel = event;
      if (this.ngayNCModel != null && this.ngayXCModel != null) {
        if (this.ngayNCModel > this.ngayXCModel) {
          $('#ngayXC'+i).val(null)
          this.alert.warn("Vui lòng nhập Ngày nhập cảnh lớn hơn Ngày xuất cảnh")
          $('#ngayXC'+i).focus()
          this.isWarningNXC = true;
        } else {
          this.showEditable = true;
          this.isWarningNXC = false;
        }
    }
    if (this.ngayXCModel == null) {
      this.isWarningNXC = false; 
      this.isWarningNNC = false;
    }
  }

  isInvalidDateNgayCapTTList(event, i) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày cấp thị thực theo định dạng DD/MM/YYYY")
      $('#hC_NgayCap'+i).focus()
    }
  }

  checkDateNgayCapTTList(event,i) {
    let ngayCapTT = event;
    if (ngayCapTT >= new Date()) {
      this.alert.warn("Ngày cấp thị thực không được lớn hơn ngày hiện tại")
      this.isWarningNCTT = true;
    } else {
      this.isWarningNCTT = false;
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
      this.isWarningNS = true;
    } else {
      this.isWarningNS = false;
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
        this.isWarningNC = true;
    } else {
      this.isWarningNC = false;
      }

    }

    if (this.ngayCap >= new Date()) {
      this.alert.warn("Ngày cấp phải nhỏ hơn ngày hiện tại")
      $('#hC_ngayCap').focus()
      this.isWarningNC = true;
    } else {
      this.isWarningNC = false;
    }
    
    if (this.ngayCap == null) {
      this.isWarningNC = false;
      this.isWarningHL = false;
    }

  }

  isInvalidDateNgaySinhList(event,i) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày sinh theo định dạng DD/MM/YYYY")
      $('#ngaySinh'+i).focus()
    }
  }

  checkDateNgaySinhList(event,i) {
    let ngaySinh = event;
    if (ngaySinh >= new Date()) {
      this.alert.warn("Ngày sinh phải nhỏ hơn ngày hiện tại")
      $('#ngaySinh' + i).focus()
      this.isWarningNS = true;
    } else {
      this.isWarningNS = false;
    }
  }

  isInvalidDateNgayCapList(event,i) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày cấp hộ chiếu theo định dạng DD/MM/YYYY")
      $('#hC_NgayCap'+i).focus()
    }
  }

  checkDateNgayCapList(event,i) {
    this.ngayCap = event;
    if(this.ngayCap != null && this.ngayHL != null) {
      if(this.ngayCap > this.ngayHL) {
        this.alert.warn("Ngày cấp không được lớn hơn ngày hết hạn")
        $('#hC_NgayCap' + i).focus()
      }
    }

    if (this.ngayCap >= new Date()) {
      this.alert.warn("Ngày cấp phải nhỏ hơn ngày hiện tại")
      $('#hC_ngayCap' + i).focus()
      this.isWarningNC = true;
    } else {
      this.isWarningNC = false;
    }

    if (this.ngayCap == null) {
      this.isWarningNC = false;
      this.isWarningHL = false;
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
      this.alert.warn("Ngày cấp thị thực không được lớn hơn ngày hiện tại")
      $('#hC_NgayCapTT').focus()
      this.isWarningNCTT = true;
    } else {
      this.isWarningNCTT = false;
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
        this.isWarningHL = true;
    } else {
      this.isWarningHL = false;
      }
    }
  
    if (this.ngayHL == null || this.ngayCap == null) {
      this.isWarningHL = false;
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
    dSThanhVienDoan.setValue(dSThanhVienDoan.value.sort((b, a) => a[FieldName] - b[FieldName]))
  }
  sortBySTT(FieldName: string) {
    console.log(dSThanhVienDoan.value, FieldName);
    dSThanhVienDoan.setValue(dSThanhVienDoan.value.sort((a, b) => a[FieldName] - b[FieldName]))
  }

  async mySortingMethod() {
    await this.sortBySTT('soTT');
    this.sortBy('type');
  }
}
