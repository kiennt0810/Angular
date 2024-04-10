import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploadVM, IFileUploadVM } from '../../file.model';
import * as fileSaver from 'file-saver';
import { ILanhDao } from '../lanhDao.model';
import { AlertService } from 'app/core/util/alert.service';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { DoanRa, IDoanRa } from '../doanRa.model';
import { IQGiaDen } from '../qGiaDen.model';
import { DoanRaService } from '../service/delegation-out.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { SessionStorageService } from 'ngx-webstorage';

const doanRaTemplate = {} as IDoanRa;
const lanhDaoTemplate = {} as ILanhDao;
const qGiaDenTemplate = {} as IQGiaDen;
const fileTemplate = {} as IFileUploadVM;
const listFile = new FormArray([]);
const lanhDao = new FormArray([]);
const quocGia = new FormArray([]);
const newDelegationIn: IDoanRa = {

} as IDoanRa;

export interface IFileUpload {
  RequestID: string;
  AttachmentName: string;
  AttachmentContent: any;
  FormType: string;
  AttachmentFlag: boolean;
}
declare var $: any;
@Component({
  selector: 'jhi-user-mgmt-detail',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class DoanRaEditComponent implements OnInit {
  doanRa: DoanRa | null = null;
  selectedFile = null;
  fileList: File[] = [];
  isuploadDocument: boolean;
  fileUploaded: IFileUpload = null;
  fileToUpload: File = null;
  totalFileSize: number;
  lstUploadedFiles: IFileUpload[] = [];
  isSaving = false;
  success = false;
  errorPassportExists = false;
  error = false;
  strLsFileDelete: string;
  countDele: number = 0;
  disableTextbox =  false;
  isShowSideBar = true;
  quocGiaList: User[] | null = null;
  tenQG: string[] = [];
  checkNameFile = true;
  nameFile: string[] = [];
  ngayNCModel:any;
  ngayXCModel:any;
  currentPath: string;
  userName: string = this.sessionStorageService.retrieve('userName');
  editForm = new FormGroup({
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
    ngayXC: new FormControl(doanRaTemplate.ngayXC),
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
    listDRFileVM: listFile,
  });

  listfileUp = new FormGroup({
    id: new FormControl(fileTemplate.id),
    fileName: new FormControl(fileTemplate.fileName),
    maHSDoan: new FormControl(fileTemplate.maHSDoan),
    type: new FormControl(fileTemplate.type),
  })

  lanhdaoUp = new FormGroup({
    iD: new FormControl(lanhDaoTemplate.iD),
    maHSDoan: new FormControl(lanhDaoTemplate.maHSDoan),
    hoTen: new FormControl(lanhDaoTemplate.hoTen),
  });

  quoGiaUp = new FormGroup({
    iD: new FormControl(qGiaDenTemplate.iD == null ? 0 : qGiaDenTemplate.iD),
    maHSDoan: new FormControl(qGiaDenTemplate.maHSDoan),
    maQG: new FormControl(qGiaDenTemplate.maQG),
    chuongTrinhHD: new FormControl(qGiaDenTemplate.chuongTrinhHD),
    noiLuuTru: new FormControl(qGiaDenTemplate.noiLuuTru),
    soNgayLuuTru: new FormControl(qGiaDenTemplate.soNgayLuuTru),
    soLuongTV: new FormControl(qGiaDenTemplate.soLuongTV)
  })
  constructor(private updateService: DoanRaService, 
    private qGService: QuocgiavavunglanhthoService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder, 
    private router: Router, 
    private alert: AlertServiceCheck,
    private navbarService: NavBarService,
    private sessionStorageService: SessionStorageService,
    ) 
  {}

  ngOnInit(): void {
    this.qGService
      .getAll()
      .subscribe({
        next: (res: HttpResponse<User[]>) => {
          this.onSuccessQG(res.body, res.headers);
        },
      });
    console.log(this.route.snapshot.params.maDoan);
    const id = this.route.snapshot.params.maDoan;
    this.totalFileSize = 0;
    this.updateService.getCurrentData(id).subscribe((result) => {
      this.doanRa = result;
      this.editForm.reset;
      this.editForm = new FormGroup({
        maDoan: new FormControl(this.doanRa.maDoan),
        tenDoan: new FormControl(this.doanRa.tenDoan , {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        }),
        truongDoan: new FormControl(this.doanRa.truongDoan , {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        }),
        chucVu: new FormControl(this.doanRa.chucVu),
        quocGia: new FormControl(this.doanRa.quocGia),
        mucDichHD: new FormControl(this.doanRa.mucDichHD),
        ngayNC: new FormControl(this.doanRa.ngayNC),
        ngayXC: new FormControl(this.doanRa.ngayXC, {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        }),
        soNgay: new FormControl(this.doanRa.soNgay),
        noiLuuTru: new FormControl(this.doanRa.noiLuuTru),
        ghiChu: new FormControl(this.doanRa.ghiChu),
        soLuongTV: new FormControl(this.doanRa.soLuongTV),
        listFile: new FormControl(this.doanRa.listFile),
        createdBy: new FormControl(this.doanRa.createdBy),
        updatedBy: new FormControl(this.doanRa.updatedBy),
        createdDate: new FormControl(this.doanRa.createdDate),
        updatedDate: new FormControl(this.doanRa.updatedDate),
        jsonLanhDao: lanhDao,
        jsonHoSoDtl: quocGia,
        listDRFileVM: listFile,
      })
      listFile.clear();
      lanhDao.clear();
      quocGia.clear();
      
      for (let index = 0; index < this.doanRa.listDRFileVM.length; index++) {
        this.listfileUp = new FormGroup({
          id: new FormControl(this.doanRa.listDRFileVM[index].id),
          fileName: new FormControl(this.doanRa.listDRFileVM[index].fileName),
          maHSDoan: new FormControl(this.doanRa.listDRFileVM[index].maHSDoan),
          type: new FormControl(this.doanRa.listDRFileVM[index].type),
        })
        listFile.push(this.listfileUp)
      }
      

      for (let index = 0; index < this.doanRa.listLanhDao.length; index++) {
        this.lanhdaoUp = new FormGroup({
          iD: new FormControl(this.doanRa.listLanhDao[index].iD),
          maHSDoan: new FormControl(this.doanRa.listLanhDao[index].maHSDoan),
          hoTen: new FormControl(this.doanRa.listLanhDao[index].hoTen),
        }) 
        lanhDao.push (
          this.lanhdaoUp,
        );
      }
      
      for (let index = 0; index < this.doanRa.listHoSoDtl.length; index++) {
        this.quoGiaUp = new FormGroup({
          iD: new FormControl(this.doanRa.listHoSoDtl[index].iD == null ? 0 : this.doanRa.listHoSoDtl[index].iD),
          maHSDoan: new FormControl(this.doanRa.listHoSoDtl[index].maHSDoan),
          maQG: new FormControl(this.doanRa.listHoSoDtl[index].maQG),
          chuongTrinhHD: new FormControl(this.doanRa.listHoSoDtl[index].chuongTrinhHD),
          noiLuuTru: new FormControl(this.doanRa.listHoSoDtl[index].noiLuuTru),
          soNgayLuuTru: new FormControl(this.doanRa.listHoSoDtl[index].soNgayLuuTru),
          soLuongTV: new FormControl(this.doanRa.listHoSoDtl[index].soLuongTV)
        }) 
        quocGia.push (
          this.quoGiaUp,
        );
      }
    });
  
    this.currentPath = this.router.url;
    console.log(this.currentPath)
    this.navbarService.getSubPath(this.currentPath, 'Sửa')
    
  }
  private onSuccessQG(users: User[] | null, headers: HttpHeaders): void {
    this.quocGiaList = users;
  }

  downloadFile(id: number, name: string) {
    this.updateService.downloadFile(id).subscribe((response: any) => {
      let blob:any = new Blob([response], { type: 'application/json; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, name);
    }), (error: any) => console.log('Error downloading the file');
  }

  previousState(): void {
    window.history.back();
  }

  addTableHDTCDP() {
    (<FormArray>this.editForm.get('jsonHoSoDtl')).push(
      new FormGroup({
        iD: new FormControl(qGiaDenTemplate.iD == null ? 0 : qGiaDenTemplate.iD),
        maHSDoan: new FormControl(qGiaDenTemplate.maHSDoan),
        maQG: new FormControl(qGiaDenTemplate.maQG),
        quocGia: new FormControl(qGiaDenTemplate.quocGia),
        chuongTrinhHD: new FormControl(qGiaDenTemplate.chuongTrinhHD),
        noiLuuTru: new FormControl(qGiaDenTemplate.noiLuuTru),
        soNgayLuuTru: new FormControl(qGiaDenTemplate.soNgayLuuTru),
        soLuongTV: new FormControl(qGiaDenTemplate.soLuongTV)
      })
    );
  }

  

  deleteRowHDTCDP(index: number) {
    var delBtn_leng = (<FormArray>this.editForm.get('jsonHoSoDtl')).length
    if (delBtn_leng > 1) {
      var delBtn = confirm(" Bạn có muốn xóa không ?");
      if (delBtn == true) {
        (<FormArray>this.editForm.get('jsonHoSoDtl')).removeAt(index);
      }
    } else {
      this.alert.warn('Dòng này không thể xóa!');
    }
  }

  addTableLDTD() {
    (<FormArray>this.editForm.get('jsonLanhDao')).push(
      new FormGroup({
        iD: new FormControl(lanhDaoTemplate.iD),
    maHSDoan: new FormControl(lanhDaoTemplate.maHSDoan),
    hoTen: new FormControl(lanhDaoTemplate.hoTen),
      })
    );
  }

  deleteRowLDTD(index: number) {
    var delBtn_leng = (<FormArray>this.editForm.get('jsonLanhDao')).length
    if (delBtn_leng > 1) {
      var delBtn = confirm(" Bạn có muốn xóa không ?");
      if (delBtn == true) {
        (<FormArray>this.editForm.get('jsonLanhDao')).removeAt(index);
      }
    } else {
      this.alert.warn('Dòng này không thể xóa!');
    }
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

  deleteRowFile(index: number, id: number) {
    var delBtn = confirm(" Bạn có muốn xóa không ?");
    if (delBtn == true) {
      (<FormArray>this.editForm.get('listDRFileVM')).removeAt(index);
      this.doanRa.listDRFileVM.splice(index,1);
      if(this.countDele == 0){
        this.strLsFileDelete = id.toString();
      } else {
        this.strLsFileDelete = this.strLsFileDelete + ',' + id.toString();
      }
      this.countDele = this.countDele + 1;
    }
  }

  get lanhDaoControls() {
    // a getter!
    return (<FormArray>this.editForm.get('jsonLanhDao')).controls;
  }

  get listFileControls() {
    // a getter!
    return (<FormArray>this.editForm.get('listDRFileVM')).controls;
  }


  get qGiaDenControls() {
    // a getter!
    return (<FormArray>this.editForm.get('jsonHoSoDtl')).controls;
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
    var flagCheck = false;
    this.isSaving = true;
    const payload = new FormData();
    const editForm = this.editForm.value;
    editForm.ngayXC = $('#ngayXC').first().val();
    editForm.ngayNC = $('#ngayNC').first().val()


    if(editForm.ngayNC != null && editForm.ngayXC != null) {
      if(!this.compareDateHL(editForm.ngayXC, editForm.ngayNC)) {
        this.alert.warn("Ngày xuất cảnh không được lớn hơn Ngày nhập cảnh")
        $('#ngayXC').focus();
        flagCheck = true;
      }
    } 
    if(flagCheck == false) {
      payload.append('maDoan', editForm.maDoan.toString());
      payload.append('tenDoan',editForm.tenDoan);
      payload.append('truongDoan', editForm.truongDoan);
      payload.append('chucVu', editForm.chucVu);
      payload.append('mucDichHD',editForm.mucDichHD);
      payload.append('ngayNC', editForm.ngayNC == null ? "" : $('#ngayNC').first().val());
      payload.append('ngayXC',editForm.ngayXC == null ? "" : $('#ngayXC').first().val());
      payload.append('soNgay', editForm.soNgay == null ? "" : editForm.soNgay.toString());
      payload.append('noiLuuTru', editForm.noiLuuTru);
      payload.append('ghiChu', editForm.ghiChu);
      payload.append('soLuongTV',editForm.soLuongTV == null ? "" : editForm.soLuongTV.toString());
      payload.append('createdBy',editForm.createdBy);
      payload.append('updatedBy', this.userName);
      payload.append('createdDate',editForm.createdDate == null ? "" : editForm.createdDate.toString());
      payload.append('updatedDate',editForm.updatedDate == null ? "" : editForm.updatedDate.toString());
      for(let i=0;i<this.fileList.length;i++){
        payload.append('listFile',this.fileList[i]);
      }   
      if (editForm.jsonLanhDao.length > 0) {
        payload.append('jsonLanhDao', JSON.stringify(editForm.jsonLanhDao));
      }
      if (editForm.jsonHoSoDtl.length > 0) {
        payload.append('JsonHoSoDtl', JSON.stringify(editForm.jsonHoSoDtl));
      }
      payload.append('strLsFileDelete', this.strLsFileDelete);
      console.log(payload.getAll('listFile'));
      if (editForm.maDoan !== null) {
        this.updateService.update(payload).subscribe({ next: (response) => this.processSuccess(response), error: response => this.processError(response) });
      }
    }
  }

  private processSuccess(response): void {
    if (Number(response.status) != 200) {
      this.alert.error('Cập nhật thông tin không thành công');
    } else {
      this.alert.success('Cập nhật thông tin thành công');
    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === "LOGIN_ALREADY_USED_TYPE") {
      this.errorPassportExists = true;
    } else {
      this.error = true;
    }
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