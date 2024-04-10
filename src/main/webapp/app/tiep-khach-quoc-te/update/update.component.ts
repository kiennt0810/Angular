import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { TKQTThongTinVM, ITKQTThongTinVM } from '../TKQTThongTinVM.model';
import { TiepkhachquocteService } from '../service/tiepkhachquoctet.service';
import { ITKQTThanhVienVM } from '../TKQTThanhVienVM.model';
import { HttpErrorResponse } from '@angular/common/http';
import { IFileUploadVM } from '../file.model';
import { HttpResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import * as fileSaver from 'file-saver';
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
const listFile = new FormArray([]);
const fileTemplate = {} as IFileUploadVM;

export interface IFileUpload {
  RequestID: string;
  AttachmentName: string;
  AttachmentContent: any;
  FormType: string;
  AttachmentFlag: boolean;
}
declare var $: any;
@Component({
  selector: 'jhi-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  TkForm: TKQTThongTinVM | null = null;
  authorities: string[] = [];
  isSaving = false;
  nameFile: string[] = [];
  chucVus: ChucVu[] | null = null;
  checkNameFile = true;
  showEditable: boolean = false;
  editRowId: any;
  isuploadDocument: boolean;
  fileList: File[] = [];
  fileToUpload: File = null;
  fileUploaded: IFileUpload = null;
  lstUploadedFiles: IFileUpload[] = [];
  totalFileSize: number;
  countDele: number = 0;
  selectedFile = null;
  showWarning1 = false;
  showWarning2 = false;
  errorPassportExists = false;
  strLsFileDelete: string;
  error = false;
  success = false;
  quocGia: User[] | null = null;
  currentPath: string;

  userName: string = this.sessionStorageService.retrieve('userName');
  editForm = new FormGroup({
    id: new FormControl(delegationInTemplate.id),
    lanhDao: new FormControl(delegationInTemplate.lanhDao, { validators: [Validators.required] }),
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
    jsonThanhVien: danhSachCN,
    jsonKhach: danhSachKhach,
    listTKQTFileVM: listFile,
  });
  listfileUp = new FormGroup({
    id: new FormControl(fileTemplate.id),
    fileName: new FormControl(fileTemplate.fileName),
    data: new FormControl(fileTemplate.data),
    type: new FormControl(fileTemplate.type),
  })

  tkqtThanhVienCNUp = new FormGroup({
    id: new FormControl(delegationInTVTemplate.id == null ? 0 : delegationInTVTemplate.id),
    soHC: new FormControl(delegationInTVTemplate.soHC),
    hoTen: new FormControl(delegationInTVTemplate.hoTen),
    chucVu: new FormControl(delegationInTVTemplate.chucVu),
    coQuan: new FormControl(delegationInTVTemplate.coQuan),
    gioiTinh: new FormControl(delegationInTVTemplate.gioiTinh),
    ngaySinh: new FormControl(delegationInTVTemplate.ngaySinh),
    type: new FormControl(delegationInTVTemplate.type),
  });

  tkqtThanhVienKhachUp = new FormGroup({
    id: new FormControl(delegationInTVTemplate.id == null ? 0 : delegationInTVTemplate.id),
    soHC: new FormControl(delegationInTVTemplate.soHC),
    hoTen: new FormControl(delegationInTVTemplate.hoTen),
    chucVu: new FormControl(delegationInTVTemplate.chucVu),
    coQuan: new FormControl(delegationInTVTemplate.coQuan),
    gioiTinh: new FormControl(delegationInTVTemplate.gioiTinh),
    ngaySinh: new FormControl(delegationInTVTemplate.ngaySinh),
    type: new FormControl(delegationInTVTemplate.type),
  })

  constructor(
    private Service: TiepkhachquocteService,
    private route: ActivatedRoute,
    private alert: AlertServiceCheck,
    private http: HttpClient,
    private qGService: QuocgiavavunglanhthoService,
    private router: Router,
    private navbarService: NavBarService,
    private ChucVuService: ChucVuService,
    private sessionStorageService: SessionStorageService,
  ) { }



  filter = {};

  ngOnInit(): void {
    this.qGService
      .getAll()
      .subscribe({
        next: (res: HttpResponse<User[]>) => {
          this.onSuccessQG(res.body, res.headers);
        },
      });
    const id = this.route.snapshot.params.id;
    this.totalFileSize = 0;
    this.Service.getCurrentData(id).subscribe((result) => {
      this.TkForm = result;
      this.editForm.reset;
      this.editForm = new FormGroup({
        id: new FormControl(this.TkForm.id),
        lanhDao: new FormControl(this.TkForm.lanhDao, { validators: [Validators.required] }),
        chucVu: new FormControl(this.TkForm.chucVu),
        doanKhach: new FormControl(this.TkForm.doanKhach, { validators: [Validators.required] }),
        quocGia: new FormControl(this.TkForm.quocGia == '' ? 'null' : this.TkForm.quocGia, { validators: [Validators.required] }),
        diaDiem: new FormControl(this.TkForm.diaDiem),
        hinhThuc: new FormControl(this.TkForm.hinhThuc),
        coQuan: new FormControl(this.TkForm.coQuan),
        thoiGianTu: new FormControl(this.TkForm.thoiGianTu),
        thoiGianDen: new FormControl(this.TkForm.thoiGianDen),
        soLuongTV: new FormControl(this.TkForm.soLuongTV),
        tinhTrang: new FormControl(this.TkForm.tinhTrang),
        listFile: new FormControl(this.TkForm.listFile),
        createdBy: new FormControl(this.TkForm.createdBy),
        updatedBy: new FormControl(this.TkForm.updatedBy),
        createdDate: new FormControl(this.TkForm.createdDate),
        updatedDate: new FormControl(this.TkForm.updatedDate),
        jsonThanhVien: danhSachCN,
        jsonKhach: danhSachKhach,
        listTKQTFileVM: listFile,
      })
      listFile.clear();
      danhSachCN.clear();
      danhSachKhach.clear();

      for (let i = 0; i < this.TkForm.listTKQTFileVM.length; i++) {
        this.listfileUp = new FormGroup({
          id: new FormControl(this.TkForm.listTKQTFileVM[i].id),
          fileName: new FormControl(this.TkForm.listTKQTFileVM[i].fileName),
          data: new FormControl(this.TkForm.listTKQTFileVM[i].data),
          type: new FormControl(this.TkForm.listTKQTFileVM[i].type),
        })
        listFile.push(this.listfileUp)
      }


      for (let i = 0; i < this.TkForm.listTKQTThanhVienVM.length; i++) {
        this.tkqtThanhVienCNUp = new FormGroup({
          id: new FormControl(this.TkForm.listTKQTThanhVienVM[i].id),
          soHC: new FormControl(this.TkForm.listTKQTThanhVienVM[i].soHC),
          hoTen: new FormControl(this.TkForm.listTKQTThanhVienVM[i].hoTen),
          chucVu: new FormControl(this.TkForm.listTKQTThanhVienVM[i].chucVu),
          coQuan: new FormControl(this.TkForm.listTKQTThanhVienVM[i].coQuan),
          gioiTinh: new FormControl(this.TkForm.listTKQTThanhVienVM[i].gioiTinh),
          ngaySinh: new FormControl(this.TkForm.listTKQTThanhVienVM[i].ngaySinh),
          type: new FormControl(this.TkForm.listTKQTThanhVienVM[i].type),
        })
        danhSachCN.push(
          this.tkqtThanhVienCNUp,
        );
      }

      for (let i = 0; i < this.TkForm.listTKQTKhachVM.length; i++) {
        this.tkqtThanhVienKhachUp = new FormGroup({
          id: new FormControl(this.TkForm.listTKQTKhachVM[i].id),
          soHC: new FormControl(this.TkForm.listTKQTKhachVM[i].soHC),
          hoTen: new FormControl(this.TkForm.listTKQTKhachVM[i].hoTen),
          chucVu: new FormControl(this.TkForm.listTKQTKhachVM[i].chucVu),
          coQuan: new FormControl(this.TkForm.listTKQTKhachVM[i].coQuan),
          gioiTinh: new FormControl(this.TkForm.listTKQTKhachVM[i].gioiTinh),
          ngaySinh: new FormControl(this.TkForm.listTKQTKhachVM[i].ngaySinh),
          type: new FormControl(this.TkForm.listTKQTKhachVM[i].type),
        })
        danhSachKhach.push(
          this.tkqtThanhVienKhachUp,
        );
      }
    });
    this.loadAllChucVu();
    this.currentPath = this.router.url;
    console.log(this.currentPath)
    this.navbarService.getSubPath(this.currentPath, 'Sửa')
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
    (<FormArray>this.editForm.get('jsonKhach')).push(
      new FormGroup({
        hoTen: new FormControl(delegationInTVTemplate.hoTen),
        gioiTinh: new FormControl(delegationInTVTemplate.gioiTinh),
        ngaySinh: new FormControl(delegationInTVTemplate.ngaySinh),
        chucVu: new FormControl(delegationInTVTemplate.chucVu),
        coQuan: new FormControl(delegationInTVTemplate.coQuan),

      })
    );
  }

  deleteRowKhach(index: number) {
    var delBtn_leng = (<FormArray>this.editForm.get('jsonKhach')).length
    if (delBtn_leng > 1) {
      var delBtn = confirm(" Bạn có muốn xóa không ?");
      if (delBtn == true) {
        (<FormArray>this.editForm.get('jsonKhach')).removeAt(index);
      }
    } else {
      this.alert.warn('Dòng này không thể xóa!');
    }

  }

  addTableCN() {
    (<FormArray>this.editForm.get('jsonThanhVien')).push(
      new FormGroup({
        hoTen: new FormControl(delegationInTVTemplate.hoTen),
        gioiTinh: new FormControl(delegationInTVTemplate.gioiTinh),
        ngaySinh: new FormControl(delegationInTVTemplate.ngaySinh),
        chucVu: new FormControl(delegationInTVTemplate.chucVu),
        coQuan: new FormControl(delegationInTVTemplate.coQuan),

      })
    );
  }

  isInvalidDate1(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY');
      event.target.value = null
    } else {
      this.showWarning1 = false
    }
  }
  isInvalidDate2(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY');
      event.target.value = null
    } else {
      this.showWarning2 = false
    }
  }
  isInvalidDate3(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY');
      event.target.value = null
    }
  }
  isInvalidDate4(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY');
      event.target.value = null
    }
  }

  deleteRowCN(index: number) {
    var delBtn_leng = (<FormArray>this.editForm.get('jsonThanhVien')).length
    if (delBtn_leng > 1) {
      var delBtn = confirm(" Bạn có muốn xóa không ?");
      if (delBtn == true) {
        (<FormArray>this.editForm.get('jsonThanhVien')).removeAt(index);
      }
    } else {
      this.alert.warn('Dòng này không thể xóa!');
    }
  }
  private onSuccessQG(qG: User[] | null, headers: HttpHeaders): void {
    this.quocGia = qG;
  }
  get controls_Khach() {
    // a getter!
    return (<FormArray>this.editForm.get('jsonKhach')).controls;
  }

  get controls_CN() {
    // a getter!
    return (<FormArray>this.editForm.get('jsonThanhVien')).controls;
  }

  get listFileControls() {
    // a getter!
    return (<FormArray>this.editForm.get('listTKQTFileVM')).controls;
  }
  downloadFile(id: number, name: string) {
    this.Service.downloadFile(id).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/json; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, name);
    }), (error: any) => console.log('Error downloading the file');
  }
  deleteRowFile(index: number, id: number) {
    var delBtn = confirm(" Bạn có muốn xóa không ?");
    if (delBtn == true) {
      (<FormArray>this.editForm.get('listTKQTFileVM')).removeAt(index);
      this.TkForm.listTKQTFileVM.splice(index, 1);
      if (this.countDele == 0) {
        this.strLsFileDelete = id.toString();
      } else {
        this.strLsFileDelete = this.strLsFileDelete + ',' + id.toString();
      }
      this.countDele = this.countDele + 1;
    }
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
        // if(this.checkNameFile){
        //   for (let j = 0; j <this.TkForm.listTKQTFileVM.length; j++) {
        //     if(this.fileToUpload.name == this.TkForm.listTKQTFileVM[j].fileName){
        //       this.checkNameFile = false;
        //       this.alert.warn('Tập tin '+this.fileToUpload.name+ ' đã tồn tại')
        //       break;
        //     }
        //   }
        // }
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
            this.alert.warn('Tải file không quá 100 MB')
          }
        }
      }
    }
    $('#inputGroupFile').val(null);
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
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
        reject(this.alert.show('Không thể tải file'));
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

  createDV(): void {

    this.isSaving = true;
    const payload = new FormData();
    const createForm = this.editForm.value;
    var checkdate = false;
    createForm.thoiGianTu = $('#thoiGianTu').first().val();
    createForm.thoiGianDen = $('#thoiGianDen').first().val();
    createForm.quocGia = $('#quocGia').first().val();
    if (String(createForm.quocGia) == 'null') {
      createForm.quocGia = '';
    }
    if ($('#lanhDao').val() == '') {
      this.alert.warn('Lãnh đạo tiếp khách không được để trống');
      $('#lanhDao').focus();
    } else if ((createForm.thoiGianTu != '' && createForm.thoiGianDen != '')) {
      if (!this.compareDateHL(createForm.thoiGianTu, createForm.thoiGianDen)) {
        this.alert.warn('Từ ngày không được lớn hơn Đến ngày');
        $('#thoiGianDen').focus();
      } else {
        payload.append('id', createForm.id.toString());
        payload.append('lanhDao', createForm.lanhDao == null ? "" : createForm.lanhDao.toString());
        payload.append('chucVu', createForm.chucVu == null ? "" : createForm.chucVu.toString());
        payload.append('coQuan', createForm.coQuan == null ? "" : createForm.coQuan.toString());
        payload.append('doanKhach', createForm.doanKhach == null ? "" : createForm.doanKhach.toString());
        payload.append('quocGia', String(createForm.quocGia) == 'null' ? "" : createForm.quocGia.toString());
        payload.append('thoiGianTu', createForm.thoiGianTu == null ? "" : createForm.thoiGianTu.toString());
        payload.append('thoiGianDen', createForm.thoiGianDen == null ? "" : createForm.thoiGianDen.toString());
        payload.append('diaDiem', createForm.diaDiem == null ? "" : createForm.diaDiem.toString());
        payload.append('hinhThuc', createForm.hinhThuc == null ? "" : createForm.hinhThuc.toString());
        payload.append('updatedBy', this.userName);
        payload.append('createdDate', createForm.createdDate == null ? "" : createForm.createdDate.toString());
        payload.append('updatedDate', createForm.updatedDate == null ? "" : createForm.updatedDate.toString());
        for (let i = 0; i < this.fileList.length; i++) {
          payload.append('listFile', this.fileList[i]);
        }
        for (let i = 0; i < createForm.jsonKhach.length; i++) {
          try {
            let [day, month, year] = createForm.jsonKhach[i].ngaySinh.split('/');
            const dateNgayHL = new Date(+year, +month - 1, +day + 1);
            createForm.jsonKhach[i].ngaySinh = dateNgayHL;
          } catch (error) {
            console.log('Thêm mới thành viên khách');
          }

          createForm.jsonKhach[i].type = 1;
          createForm.jsonKhach[i].id = 0;
          createForm.jsonKhach[i].ngaySinh = $('#ngaySinhTVKhach' + i).first().val();
          if (String(createForm.jsonKhach[i].ngaySinh) == '') {
            createForm.jsonKhach[i].ngaySinh = '';
          } else if (!this.compareDate(createForm.jsonKhach[i].ngaySinh)) {
            this.alert.warn('Ngày sinh không được lớn hơn ngày hiện tại!');
            $('#ngaySinhTVKhach' + i).focus();
            checkdate = true;
            break;
          }
          if (String(createForm.jsonKhach[i].gioiTinh) == 'null') {
            createForm.jsonKhach[i].gioiTinh = '';
          }
        }
        for (let i = 0; i < createForm.jsonThanhVien.length; i++) {
          try {
            let [day, month, year] = createForm.jsonThanhVien[i].ngaySinh.split('/');
            const dateNgayHL = new Date(+year, +month - 1, +day + 1);
            createForm.jsonThanhVien[i].ngaySinh = dateNgayHL;
          } catch (error) {
            console.log('Thêm mới thành viên VN');
          }
          createForm.jsonThanhVien[i].type = 0;
          createForm.jsonThanhVien[i].id = 0;
          createForm.jsonThanhVien[i].ngaySinh = $('#ngaySinhTVVN' + i).first().val();
          if (String(createForm.jsonThanhVien[i].ngaySinh) == '') {
            createForm.jsonThanhVien[i].ngaySinh = '';
          } else if (!this.compareDate(createForm.jsonThanhVien[i].ngaySinh)) {
            this.alert.warn('Ngày sinh không được lớn hơn ngày hiện tại!');
            $('#ngaySinhTVVN' + i).focus();
            checkdate = true;
            break;
          }
          if (String(createForm.jsonThanhVien[i].gioiTinh) == 'null') {
            createForm.jsonThanhVien[i].gioiTinh = '';
          }
        }
        payload.append('JsonKhach', JSON.stringify(createForm.jsonKhach));
        payload.append('JsonThanhVien', JSON.stringify(createForm.jsonThanhVien));
        payload.append('strLsFileDelete', this.strLsFileDelete);
        console.log(payload.getAll('listFile'));
        if (createForm.lanhDao !== null && checkdate == false) {
          this.Service.update(payload).subscribe({ next: (response) => this.processSuscess(response), error: response => this.processError(response) });
        }
      }

    } else {
      payload.append('id', createForm.id.toString());
      payload.append('lanhDao', createForm.lanhDao == null ? "" : createForm.lanhDao.toString());
      payload.append('chucVu', createForm.chucVu == null ? "" : createForm.chucVu.toString());
      payload.append('coQuan', createForm.coQuan == null ? "" : createForm.coQuan.toString());
      payload.append('doanKhach', createForm.doanKhach == null ? "" : createForm.doanKhach.toString());
      payload.append('quocGia', createForm.quocGia == null ? "" : createForm.quocGia.toString());
      payload.append('thoiGianTu', createForm.thoiGianTu == null ? "" : createForm.thoiGianTu.toString());
      payload.append('thoiGianDen', createForm.thoiGianDen == null ? "" : createForm.thoiGianDen.toString());
      payload.append('diaDiem', createForm.diaDiem == null ? "" : createForm.diaDiem.toString());
      payload.append('hinhThuc', createForm.hinhThuc == null ? "" : createForm.hinhThuc.toString());
      payload.append('createdBy', createForm.createdBy);
      payload.append('updatedBy', createForm.updatedBy);
      payload.append('createdDate', createForm.createdDate == null ? "" : createForm.createdDate.toString());
      payload.append('updatedDate', createForm.updatedDate == null ? "" : createForm.updatedDate.toString());
      for (let i = 0; i < this.fileList.length; i++) {
        payload.append('listFile', this.fileList[i]);
      }
      for (let i = 0; i < createForm.jsonKhach.length; i++) {
        try {
          let [day, month, year] = createForm.jsonKhach[i].ngaySinh.split('/');
          const dateNgayHL = new Date(+year, +month - 1, +day + 1);
          createForm.jsonKhach[i].ngaySinh = dateNgayHL;
        } catch (error) {
          console.log('Thêm mới thành viên khách');
        }

        createForm.jsonKhach[i].type = 1;
        createForm.jsonKhach[i].id = 0;
        createForm.jsonKhach[i].ngaySinh = $('#ngaySinhTVKhach' + i).first().val();
        if (String(createForm.jsonKhach[i].ngaySinh) == '') {
          createForm.jsonKhach[i].ngaySinh = '';
        } else if (!this.compareDate(createForm.jsonKhach[i].ngaySinh)) {
          this.alert.warn('Ngày sinh không được lớn hơn ngày hiện tại!');
          $('#ngaySinhTVKhach' + i).focus();
          checkdate = true;
          break;
        }
        if (String(createForm.jsonKhach[i].gioiTinh) == 'null') {
          createForm.jsonKhach[i].gioiTinh = '';
        }
      }
      for (let i = 0; i < createForm.jsonThanhVien.length; i++) {
        try {
          let [day, month, year] = createForm.jsonThanhVien[i].ngaySinh.split('/');
          const dateNgayHL = new Date(+year, +month - 1, +day + 1);
          createForm.jsonThanhVien[i].ngaySinh = dateNgayHL;
        } catch (error) {
          console.log('Thêm mới thành viên VN');
        }
        createForm.jsonThanhVien[i].type = 0;
        createForm.jsonThanhVien[i].id = 0;
        createForm.jsonThanhVien[i].ngaySinh = $('#ngaySinhTVVN' + i).first().val();
        if (String(createForm.jsonThanhVien[i].ngaySinh) == '') {
          createForm.jsonThanhVien[i].ngaySinh = '';
        } else if (!this.compareDate(createForm.jsonThanhVien[i].ngaySinh)) {
          this.alert.warn('Ngày sinh không được lớn hơn ngày hiện tại!');
          $('#ngaySinhTVVN' + i).focus();
          checkdate = true;
          break;
        }
        if (String(createForm.jsonThanhVien[i].gioiTinh) == 'null') {
          createForm.jsonThanhVien[i].gioiTinh = '';
        }
      }
      payload.append('JsonKhach', JSON.stringify(createForm.jsonKhach));
      payload.append('JsonThanhVien', JSON.stringify(createForm.jsonThanhVien));
      payload.append('strLsFileDelete', this.strLsFileDelete);
      console.log(payload.getAll('listFile'));
      if (createForm.lanhDao !== null && checkdate == false) {
        this.Service.update(payload).subscribe({ next: (response) => this.processSuscess(response), error: response => this.processError(response) });
      }
    }
  }

  private processSuscess(response): void {
    console.log(response);
    if (Number(response.status) != 200) {
      this.alert.error('Cập nhật không thành công');
      //this.toast.addAlert({ message: 'Thêm mới không thành công', type: 'danger', toast: true, timeout: 1000 });
    } else {
      this.router.navigate(['/tiep-khach-quoc-te']);
      this.alert.success('Cập nhật thành công');
      //this.toast.addAlert({ message: 'Thêm mới hộ chiếu thành công', type: 'success', toast: true, timeout: 1000 });

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


