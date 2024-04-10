import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IHDNgoaiGiaoVM, HDNgoaiGiaoVM } from '../HDNgoaiGiaoVM.model';
import { NgoaiGiaoDoanService } from '../service/ngoai-giao-doan.service';
import { IHDNgoaiGiaoDtlVM, HDNgoaiGiaoDtlVM } from '../HDNgoaiGiaoDtlVM.model';
import { IHDNgoaiGiaoDtlFileVM } from '../HDNgoaiGiaoDtlFileVM.model';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import fileSaver from 'file-saver';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { SessionStorageService } from 'ngx-webstorage';
const delegationInTemplate = {} as IHDNgoaiGiaoVM;
const delegationInTVTemplate = {} as IHDNgoaiGiaoDtlVM;
const danhSach = new FormArray([]);
const listOldFileDownload = new FormArray([]);

const fileTemplate = {} as IHDNgoaiGiaoDtlFileVM;

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
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  totalPage = 0;


  TkForm: HDNgoaiGiaoVM | null = null;
  isSaving = false;
  showEditable: boolean = false;
  editRowId: any;
  isuploadDocument: boolean;
  fileList: File[] = [];
  fileToUpload: File = null;
  fileUploaded: IFileUpload = null;
  lstUploadedFiles: IFileUpload[] = [];
  totalFileSize: number;
  countDele: number = 0;
  countTPTDDele: number = 0;
  strTPTDDelete: string;
  strLsFileDelete: string;
  quocGia: User[] | null = null;
  errorPassportExists = false;
  error = false;
  success = false;
  showWarning = false;
  currentPath: string;

  tangPham: any[];
  tangPhamKhac = false;
  disableTextbox = false;
  dataTangPham: string;
  nameFile: string[] = [];
  checkNameFile = true;
  selectedFile = null;

  userName: string = this.sessionStorageService.retrieve('userName');

  editForm = new FormGroup({
    id: new FormControl(delegationInTemplate.id),
    tenHD: new FormControl(delegationInTemplate.tenHD, { validators: [Validators.required] }),
    coQuan: new FormControl(delegationInTemplate.coQuan),
    quocGia: new FormControl(delegationInTemplate.quocGia),
    hinhThuc: new FormControl(delegationInTemplate.hinhThuc),
    tangPham: new FormControl(delegationInTemplate.tangPham),
    thoiGian: new FormControl(delegationInTemplate.thoiGian, { validators: [Validators.required] }),
    diaDiem: new FormControl(delegationInTemplate.diaDiem),
    ghiChu: new FormControl(delegationInTemplate.ghiChu),
    fileHoSo: new FormControl(delegationInTemplate.fileHoSo),

    updatedBy: new FormControl(delegationInTemplate.updatedBy),
    createdDate: new FormControl(delegationInTemplate.createdDate),
    updatedDate: new FormControl(delegationInTemplate.updatedDate),
    JsonThanhPhanThamDu: danhSach,
    listHDDtlFileVM: listOldFileDownload,

  });

  listfileUp = new FormGroup({
    id: new FormControl(fileTemplate.id),
    fileName: new FormControl(fileTemplate.fileName),
    hdrID: new FormControl(fileTemplate.hdrID),
    type: new FormControl(fileTemplate.type),
  })

  lsHDNgoaiGiaoDtlUp = new FormGroup({
    id: new FormControl(delegationInTVTemplate.id == null ? 0 : delegationInTVTemplate.id),
    stt: new FormControl(delegationInTVTemplate.stt == null ? 0 : delegationInTVTemplate.stt),
    hoTen: new FormControl(delegationInTVTemplate.hoTen),
    chucVu: new FormControl(delegationInTVTemplate.chucVu),
    coQuan: new FormControl(delegationInTVTemplate.coQuan),
    gioiTinh: new FormControl(delegationInTVTemplate.gioiTinh),
  });
  constructor(
    private Service: NgoaiGiaoDoanService,
    private route: ActivatedRoute,
    private alert: AlertServiceCheck,
    private http: HttpClient,
    private fb: FormBuilder,
    private qGService: QuocgiavavunglanhthoService,
    private router: Router,
    private navbarService: NavBarService,
    private activatedRoute: ActivatedRoute,
    private sessionStorageService: SessionStorageService,
  ) { }

  filter = {};


  ngOnInit(): void {
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

    this.qGService.getAll().subscribe({
      next: (res: HttpResponse<User[]>) => {
        this.onSuccessQG(res.body, res.headers);
      },
    });
    const id = this.route.snapshot.params.id;
    this.totalFileSize = 0;
    this.Service.getCurrentData(id).subscribe((result) => {
      this.TkForm = result;
      this.TkForm.tangPham = result.tangHoa;
      this.TkForm.lsThanhPhanThamDu = result.lsThanhPhanThamDu;
      this.editForm.reset;
      this.countDele = 0;
      listOldFileDownload.clear();
      danhSach.clear();
      this.totalItems = Number(this.TkForm.lsThanhPhanThamDu.length);
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
      this.page = 1;
      for (let i = 0; i < this.TkForm.lsThanhPhanThamDu.length; i++) {
        const lstForm = this.TkForm.lsThanhPhanThamDu[i];
        const lsHDNgoaiGiaoDtlUpFormGroup = this.fb.group({
          id: this.TkForm.lsThanhPhanThamDu[i].id,
          stt: this.TkForm.lsThanhPhanThamDu[i].stt,
          hoTen: this.TkForm.lsThanhPhanThamDu[i].hoTen,
          chucVu: this.TkForm.lsThanhPhanThamDu[i].chucVu,
          coQuan: this.TkForm.lsThanhPhanThamDu[i].coQuan,
          gioiTinh: this.TkForm.lsThanhPhanThamDu[i].gioiTinh,
        });

        danhSach.push(lsHDNgoaiGiaoDtlUpFormGroup);
      }

      for (let i = 0; i < this.TkForm.listHDDtlFileVM.length; i++) {
        const lstForm = this.TkForm.lsThanhPhanThamDu[i];
        const lsOldFileFormGroup = this.fb.group({
          id: this.TkForm.listHDDtlFileVM[i].id,
          fileName: this.TkForm.listHDDtlFileVM[i].fileName,
        });

        listOldFileDownload.push(lsOldFileFormGroup);
      }



      // Creating the main form group
      this.editForm = this.fb.group({
        id: new FormControl(this.TkForm.id),
        tenHD: new FormControl(this.TkForm.tenHD, { validators: [Validators.required] }),
        coQuan: new FormControl(this.TkForm.coQuan),
        quocGia: new FormControl(this.TkForm.quocGia == '' ? "null" : this.TkForm.quocGia),
        hinhThuc: new FormControl(this.TkForm.hinhThuc),
        tangPham: new FormControl(this.TkForm.tangPham),
        thoiGian: new FormControl(this.TkForm.thoiGian, { validators: [Validators.required] }),
        diaDiem: new FormControl(this.TkForm.diaDiem),
        ghiChu: new FormControl(this.TkForm.ghiChu),
        fileHoSo: new FormControl(this.TkForm.fileHoSo),

        updatedBy: new FormControl(this.TkForm.updatedBy),
        createdDate: new FormControl(this.TkForm.createdDate),
        updatedDate: new FormControl(this.TkForm.updatedDate),
        JsonThanhPhanThamDu: danhSach,
        listHDDtlFileVM: listOldFileDownload,
      });
      if (String(this.TkForm.tangPham) != 'undefined') {
        let temp = this.TkForm.tangPham.split(',');
        for (let j = 0; j < this.tangPham.length; j++) {
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] == this.tangPham[j].id) {
              this.tangPham[j].checked = true;
            }
            if (String(temp[i]) != '1' && String(temp[i]) != '2' && String(temp[i]) != '3' && String(temp[i]) != 'null') {
              this.tangPhamKhac = true;
              this.dataTangPham = temp[i];
            } else {
              this.dataTangPham = '';
              this.tangPhamKhac = false;
            }
          }
        }
      } else {
        this.dataTangPham = '';
        this.tangPhamKhac = false;
      }


    });
    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Sửa');

  }

  transition(): void {
    const id = this.route.snapshot.params.id;
    this.router.navigate(['./edit/' + id], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
      },
    });
  }

  downloadFile(id: number, name: string) {
    this.Service.downloadFile(id).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/json; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, name);
    }), (error: any) => console.log('Error downloading the file');
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


  deleteRowFile(index: number) {
    var delBtn = confirm(" Bạn có muốn xóa không ?");
    if (delBtn == true) {
      var arrayControl = this.editForm.get('listHDDtlFileVM') as FormArray;
      var id = arrayControl.at(index).value.id;
      (<FormArray>this.editForm.get('listHDDtlFileVM')).removeAt(index);
      if (this.countDele == 0) {
        this.strLsFileDelete = String(id);
        this.countDele = 1;
      } else {
        this.strLsFileDelete = this.strLsFileDelete + ',' + String(id);
      }
    }
  }
  get listFileControls() {
    // a getter!
    return (<FormArray>this.editForm.get('listHDDtlFileVM')).controls;
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
            this.alert.error('Tải file không quá 100 MB');
          }
        }
      }
    }
  }

  get result() {
    this.tangPhamKhac = false;
    var tangPham = this.tangPham.filter(item => item.checked).map(item => item);
    for (let i = 0; i < tangPham.length; i++) {
      if (tangPham[i].name == 'Khác') {
        this.tangPhamKhac = true;
      } else {
        this.tangPhamKhac = false;
      }
    }
    return this.tangPhamKhac;
  }

  addRowTable() {
    this.TkForm.lsThanhPhanThamDu.push(new HDNgoaiGiaoDtlVM());
    (<FormArray>this.editForm.get('JsonThanhPhanThamDu')).push(
      new FormGroup({
        id: new FormControl(delegationInTVTemplate.id),
        hoTen: new FormControl(delegationInTVTemplate.hoTen),
        chucVu: new FormControl(delegationInTVTemplate.chucVu),
        coQuan: new FormControl(delegationInTVTemplate.coQuan),
        gioiTinh: new FormControl(delegationInTVTemplate.gioiTinh),
      })
    );
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

  deleteRowTable(index: number) {
    var delBtn_leng = (<FormArray>this.editForm.get('JsonThanhPhanThamDu')).length
    if (delBtn_leng > 1) {
      var delBtn = confirm(" Bạn có muốn xóa không ?");
      var arrayControl = this.editForm.get('JsonThanhPhanThamDu') as FormArray;
      var id = arrayControl.at(index).value.id;
      if (delBtn == true) {
        (<FormArray>this.editForm.get('JsonThanhPhanThamDu')).removeAt(index);
        if (this.countTPTDDele == 0) {
          this.strTPTDDelete = String(id);
          this.countTPTDDele = 1;
        } else {
          this.strTPTDDelete = this.strTPTDDelete + ',' + String(id);
        }
      }
    } else {
      this.alert.warn('Dòng này không thể xóa.');
    }

  }

  private onSuccessQG(qG: User[] | null, headers: HttpHeaders): void {
    this.quocGia = qG;
  }
  get controls() {
    // a getter!
    return (<FormArray>this.editForm.get('JsonThanhPhanThamDu')).controls;
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
  tangHoa: string;
  createDV(): void {
    var countTP = 0;
    var checkTP = false;
    this.isSaving = true;
    const payload = new FormData();
    const editForm = this.editForm.value;
    editForm.thoiGian = $('#thoiGian').first().val();
    editForm.tangPham = $('#tangPham').first().val();
    if ($('#tenHD').val() == '') {
      this.alert.error('Tên hoạt động không được để trống!');
      $('#tenHD').focus();
    } else if ($('#thoiGian').val() == '') {
      this.alert.error('Thời gian không được để trống!');
      $('#thoiGian').focus();
    } else {
      payload.append('id', editForm.id.toString());
      payload.append('tenHD', editForm.tenHD == null ? "" : editForm.tenHD.toString());
      payload.append('coQuan', editForm.coQuan == null ? "" : editForm.coQuan.toString());
      payload.append('quocGia', editForm.quocGia == null ? "" : editForm.quocGia.toString());
      payload.append('hinhThuc', editForm.hinhThuc == null ? "" : editForm.hinhThuc.toString());
      payload.append('thoiGian', editForm.thoiGian == null ? "" : editForm.thoiGian.toString());
      payload.append('diaDiem', editForm.diaDiem == null ? "" : editForm.diaDiem.toString());
      payload.append('ghiChu', editForm.ghiChu == null ? "" : editForm.ghiChu.toString());
      payload.append('updatedBy', this.userName);
      payload.append('createdDate', editForm.createdDate == null ? "" : editForm.createdDate.toString());
      payload.append('updatedDate', editForm.updatedDate == null ? "" : editForm.updatedDate.toString());
      for (let i = 0; i < this.fileList.length; i++) {
        payload.append('listFile', this.fileList[i]);
      }
      var tangPham = this.tangPham.filter(item => item.checked).map(item => item);
      for (let i = 0; i < tangPham.length; i++) {
        if (tangPham[i].checked) {
          if (countTP == 0) {
            this.tangHoa = tangPham[i].id.toString();
            countTP++;
          } else {
            this.tangHoa = this.tangHoa + "," + tangPham[i].id.toString();
          }
        }
      }
      if ((editForm.tangPham != null || editForm.tangPham != undefined) && this.tangHoa != '') {
        editForm.tangPham = ',' + editForm.tangPham;
      } else {
        editForm.tangPham = '';
      }
      for (let i = 0; i < editForm.JsonThanhPhanThamDu.length; i++) {
        editForm.JsonThanhPhanThamDu[i].id = 0;
        if (String(editForm.JsonThanhPhanThamDu[i].gioiTinh) == 'null') {
          editForm.JsonThanhPhanThamDu[i].gioiTinh = null;
        }
      }
      payload.append('tangHoa', this.tangHoa + editForm.tangPham);
      payload.append('JsonThanhPhanThamDu', JSON.stringify(editForm.JsonThanhPhanThamDu));
      payload.append('strLsFileDelete', this.strLsFileDelete);
      payload.append('strDtlDelete', this.strTPTDDelete);
      console.log(payload.getAll('listFile'));
      if (editForm.tenHD !== null) {
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
      this.router.navigate(['/ngoai-giao-doan']);
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

danhSach.push(
  new FormGroup({
    id: new FormControl(delegationInTVTemplate.id),
    hoTen: new FormControl(delegationInTVTemplate.hoTen),
    chucVu: new FormControl(delegationInTVTemplate.chucVu),
    coQuan: new FormControl(delegationInTVTemplate.coQuan),
    gioiTinh: new FormControl(delegationInTVTemplate.gioiTinh),
  }),
);

