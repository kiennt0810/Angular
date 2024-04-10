import { Component, Injectable, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlDirective, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDelegationIn } from '../doanVao.model';
import { CategoriesManagementService } from '../service/categories-management.service';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'app/core/util/alert.service';
import { ILanhDao } from '../lanhDao.model';
import { IDiaPhuong } from '../diaPhuong.model';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';



const delegationInTemplate = {} as IDelegationIn;
const lanhDaoTemplate = {} as ILanhDao;
const diaPhuongTemplate = {} as IDiaPhuong;
const lanhDao = new FormArray([]);
const diaPhuong = new FormArray([]);
const newDelegationIn: IDelegationIn = {

} as IDelegationIn;

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
  maDoanV = null;
  success = false;
  errorPassportExists = false;
  error = false;
  isShowSideBar = true;
  disableTextbox =  false;
  fileList: File[] = [];
  citems: User[] | null = null;
  createFormMV: any;
  anNinhChecked: string;
  maDoanRa:number;
  tenQG: string;
  checkNameFile = true;
  nameFile: string[] = [];
  ngayNCModel:any;
  ngayXCModel:any;
  ngayNCChange:any;
  ngayXCChange:any;
  tuNgayModel:any
  denNgayModel:any
  tuNgayChange:any
  denNgayChange:any
  countDate:any
  currentPath: string;
  anNinh  = [
    {
      id:1,
      name:'Cảnh sát dẫn đường',
      checked: false
    },
    {
      id:2,
      name:'Tiếp cận trưởng đoàn',
      checked: false
    },
    {
      id:3,
      name:'Xe y tế tháp tùng',
      checked: false
    },
    {
      id:4,
      name:'Xe y tế đón, tiễn',
      checked: false
    },
    {
      id:5,
      name:'Bác sĩ tháp tùng đi địa phương',
      checked: false
    },
  ];
  createForm = new FormGroup({
    maDoan: new FormControl(delegationInTemplate.maDoan),
    tenDoan: new FormControl(delegationInTemplate.tenDoan, {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    truongDoan: new FormControl(delegationInTemplate.truongDoan, {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    maQG: new FormControl(delegationInTemplate.maQG, {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    quocGia: new FormControl(delegationInTemplate.quocGia),
    mucDichHD: new FormControl(delegationInTemplate.mucDichHD, {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    ngayNC: new FormControl(delegationInTemplate.ngayNC, {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
    ngayXC: new FormControl(delegationInTemplate.ngayXC),
    soNgay: new FormControl(delegationInTemplate.soNgay),
    noiLuuTru: new FormControl(delegationInTemplate.noiLuuTru),
    anNinh: new FormControl(delegationInTemplate.anNinh),
    ghiChu: new FormControl(delegationInTemplate.ghiChu),
    soLuongTV: new FormControl(delegationInTemplate.soLuongTV),
    listFile: new FormControl(delegationInTemplate.listFile),
    createdBy: new FormControl(delegationInTemplate.createdBy),
    updatedBy: new FormControl(delegationInTemplate.updatedBy ),
    createdDate: new FormControl(delegationInTemplate.createdDate),
    updatedDate: new FormControl(delegationInTemplate.updatedDate),
    jsonLanhDao: lanhDao,
    jsonHDTaiDP: diaPhuong,
  });

  constructor(
    private delegationInService: CategoriesManagementService,
    private route: ActivatedRoute,
    private qGService: QuocgiavavunglanhthoService,
    private alert: AlertServiceCheck,
    private router: Router,
    private navbarService: NavBarService
    ) {
  }


  ngOnInit(): void {
    lanhDao.clear();
    diaPhuong.clear();
    window.onload;
    this.totalFileSize = 0;
    this.qGService
      .getAll()
      .subscribe({
        next: (res: HttpResponse<User[]>) => {
          this.onSuccessQG(res.body, res.headers);
        },
      });
    this.route.data.subscribe(({ delegationIn }) => {
      if (delegationIn) {
        this.createForm.reset(delegationIn);
      } else {
        this.createForm.reset(newDelegationIn);
      }
    });
    this.delegationInService.authorities().subscribe(authorities => (this.authorities = authorities));
    console.log(this.disableTextbox);
    lanhDao.push (
      new FormGroup({
        iD: new FormControl(lanhDaoTemplate.iD == null ? 0 : lanhDaoTemplate.iD),
        maHSDoan: new FormControl(lanhDaoTemplate.maHSDoan),
        hoTen: new FormControl(lanhDaoTemplate.hoTen),
      }),
    );
    
    diaPhuong.push (
      new FormGroup({
        iD: new FormControl(diaPhuongTemplate.iD == null ? 0 : diaPhuongTemplate.iD),
        maHSDoan: new FormControl(diaPhuongTemplate.maHSDoan),
        diaPhuong: new FormControl(diaPhuongTemplate.diaPhuong),
        tuNgay: new FormControl(diaPhuongTemplate.tuNgay),
        denNgay: new FormControl(diaPhuongTemplate.denNgay),
      }),
    );
    this.currentPath = this.router.url;
    console.log(this.currentPath)
    this.navbarService.getSubPath(this.currentPath, 'Thêm mới')
  }

  private onSuccessQG(qG: User[] | null, headers: HttpHeaders): void {
    this.citems = qG;
  }

  addTableHDTCDP() {
    (<FormArray>this.createForm.get('jsonHDTaiDP')).push(
      new FormGroup({
        iD: new FormControl(diaPhuongTemplate.iD),
        maHSDoan: new FormControl(diaPhuongTemplate.maHSDoan),
        diaPhuong: new FormControl(diaPhuongTemplate.diaPhuong),
        tuNgay: new FormControl(diaPhuongTemplate.tuNgay),
        denNgay: new FormControl(diaPhuongTemplate.denNgay),
      })
    );
  }

  deleteRowHDTCDP(index: number) {
    var delBtn_leng = (<FormArray>this.createForm.get('jsonHDTaiDP')).length
    if (delBtn_leng > 1) {
      var delBtn = confirm(" Bạn có muốn xóa không ?");
      if (delBtn == true) {
        (<FormArray>this.createForm.get('jsonHDTaiDP')).removeAt(index);
      }
    } else {
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

  get diaPhuongControls() {
    // a getter!
    return (<FormArray>this.createForm.get('jsonHDTaiDP')).controls;
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

  remove(filename: string, i: number): void {
    this.fileList.splice(i,1);
    this.nameFile.splice(i,1);
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
        reject(this.alert.error('Không thể tải file'));
      };
      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsDataURL(inputFile);
    });
  }

  formatDate(ngay: string) {
    let year = ngay.substring(0,4);
    let month = ngay.substring(5,7);
    let day = ngay.substring(8,10);
    return [day, month, year].join('/');
  }

  createDV(): void {
    let flagCheck = false;
    this.isSaving = true;
    const payload = new FormData();
    this.createFormMV = this.createForm.value
    if(this.createFormMV.jsonHDTaiDP != null) {
      for (let index = 0; index < this.createFormMV.jsonHDTaiDP.length; index++) {
        if(this.createFormMV.jsonHDTaiDP[index].tuNgay > this.createFormMV.jsonHDTaiDP[index].denNgay) {
          this.alert.warn("Vui lòng nhập từ ngày nhỏ hơn hoặc bằng đến ngày ở số thứ tự " + (index + 1))
          flagCheck = true;
        }
      }
    } 
    if(this.createFormMV.ngayNC != null && this.createFormMV.ngayXC != null) {
      if(this.createFormMV.ngayNC > this.createFormMV.ngayXC) {
        this.alert.warn("Ngày nhập cảnh không được lớn hơn ngày xuất cảnh")
        $('#ngayNC').focus();
        flagCheck = true;
      }
    }
    if(!flagCheck) {
      payload.append('maDoan', this.createFormMV.maDoan == null ? "" : this.createFormMV.maDoan);
      payload.append('tenDoan',this.createFormMV.tenDoan == null ? "" : this.createFormMV.tenDoan.trim());
      payload.append('truongDoan', this.createFormMV.truongDoan == null ? "" : this.createFormMV.truongDoan.trim());
      payload.append('maQG', this.createFormMV.maQG == null ? "" : this.createFormMV.maQG);
      payload.append('quocGia', this.tenQG == null ? "" : this.tenQG);
      payload.append('mucDichHD',this.createFormMV.mucDichHD == null ? "" : this.createFormMV.mucDichHD.trim());
      payload.append('ngayNC', $('#ngayNC').first().val() == null ? "" : $('#ngayNC').first().val());
      payload.append('ngayXC',$('#ngayXC').first().val() == null ? "" : $('#ngayXC').first().val());
      payload.append('soNgay', this.createFormMV.soNgay == null ? "" : this.createFormMV.soNgay.toString());
      payload.append('noiLuuTru', this.createFormMV.noiLuuTru == null ? "" : this.createFormMV.noiLuuTru.trim());
      var t = this.anNinh
       .filter(opt => opt.checked)
       .map(opt => opt);
       var count= 0;
       for(let i=0;i<t.length;i++){
        if(t[i].checked) {
          if(count == 0) {
            this.anNinhChecked = t[i].id.toString();
            count++;
          } else {
            this.anNinhChecked = this.anNinhChecked + "," + t[i].id.toString();
          }
        }
       }
      payload.append('anNinh', this.anNinhChecked == null ? "" : this.anNinhChecked);
      payload.append('ghiChu', this.createFormMV.ghiChu == null ? "" : this.createFormMV.ghiChu.trim());
      payload.append('soLuongTV',this.createFormMV.soLuongTV == null ? "0" : this.createFormMV.soLuongTV.toString());
      payload.append('createdBy',JSON.parse(sessionStorage.getItem('jhi-userName')));
      payload.append('updatedBy',this.createFormMV.updatedBy == null ? "" : this.createFormMV.updatedBy);
      payload.append('createdDate',this.createFormMV.createdDate == null ? "" : this.createFormMV.createdDate.toString());
      payload.append('updatedDate',this.createFormMV.updatedDate == null ? "" : this.createFormMV.updatedDate.toString());
      for(let i=0;i<this.fileList.length;i++){
        payload.append('listFile',this.fileList[i]);
      }   
      if(this.createFormMV.jsonLanhDao != null) {
          payload.append('jsonLanhDao',JSON.stringify(this.createFormMV.jsonLanhDao));
      }
      if(this.createFormMV.jsonHDTaiDP != null) {
        for (let index = 0; index < this.createFormMV.jsonHDTaiDP.length; index++) {
          this.createFormMV.jsonHDTaiDP[index].tuNgay =  $('#tuNgay'+index).first().val() == null ? "" : $('#tuNgay'+index).first().val();
          this.createFormMV.jsonHDTaiDP[index].denNgay =  $('#denNgay'+index).first().val() == null ? "" : $('#denNgay'+index).first().val();
          
        }
        payload.append('jsonHDTaiDP',JSON.stringify(this.createFormMV.jsonHDTaiDP));
      }
      if (this.createFormMV.tenDoan !== null) {
        this.delegationInService.create(payload).subscribe({ next: () => (this.success = false), error: response => this.processError(response) });
      }
    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status !== 200) {
      this.alert.error('Thêm mới không thành công');
    } else {
        this.alert.success('Lưu thành công. Vui lòng chọn "Thêm mới thành viên" để thêm mới thành viên đoàn vào');
        this.isShowSideBar = !this.isShowSideBar;
        this.disableTextbox = !this.disableTextbox; 
        this.createFormMV.maDoan = response.error.text;
        this.createFormMV.quocGia = this.tenQG;
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
    this.createFormMV = this.createForm.value;
    this.router.navigateByUrl(`/doanVao/quanLyTV/new/${this.createFormMV.maDoan}`, { state: this.createFormMV });
    //this.router.navigateByUrl('/doanVao/quanLyTV/new', { state: this.createFormMV });
  }

  handleChange($event) {
    let index = $event.target.selectedIndex - 1;
    console.log(this.citems[index]);
    this.tenQG = this.citems[index].ten;
  }

  isInvalidDateNgayNC(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày nhập cảnh theo định dạng DD/MM/YYYY")
      this.countDate = 0;
      $('#ngayNC').focus
    }
  }

  isInvalidDateNgayXC(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày xuất cảnh theo định dạng DD/MM/YYYY")
      this.countDate = 0;
      $('#ngayXC').focus
  }
}

  isInvalidDateTuNgay(event,i) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập từ ngày theo định dạng DD/MM/YYYY")
      $('#tuNgay'+i).focus
  }
}

  isInvalidDateDenNgay(event,i) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.alert.warn("Vui lòng nhập đến ngày theo định dạng DD/MM/YYYY")
      $('#denNgay'+i).focus
  }

}

checkDateNgayNC($event) {
  this.ngayNCModel = $event;
    if (this.ngayNCModel != null && this.ngayXCModel != null) {
      if (this.ngayNCModel > this.ngayXCModel) {
        this.alert.warn("Vui lòng nhập Ngày nhập cảnh nhỏ hơn Ngày xuất cảnh")
        this.countDate = 0;
        this.ngayNCChange = null;
        $('#ngayNC').focus()
      } else {
        const time = Math.floor(Date.UTC(this.ngayXCModel.getFullYear(), this.ngayXCModel.getMonth(), this.ngayXCModel.getDate()) - Date.UTC(this.ngayNCModel.getFullYear(), this.ngayNCModel.getMonth(), this.ngayNCModel.getDate()));
        this.countDate = time / (1000 * 3600 * 24);
      }
    }
    if($('#ngayNC').first().val() == 'Invalid date') {
      this.ngayNCChange = null;
      this.countDate = 0;
    }
}

checkDateNgayXC($event) {
  this.ngayXCModel = $event;
    if (this.ngayNCModel != null && this.ngayXCModel != null) {
      if (this.ngayNCModel > this.ngayXCModel) {
        this.alert.warn("Vui lòng nhập Ngày xuất cảnh lớn hơn Ngày nhập cảnh")
        this.countDate = 0;
        this.ngayXCChange = null;
        $('#ngayXC').focus()
      } else {
        const time = Math.floor(Date.UTC(this.ngayXCModel.getFullYear(), this.ngayXCModel.getMonth(), this.ngayXCModel.getDate()) - Date.UTC(this.ngayNCModel.getFullYear(), this.ngayNCModel.getMonth(), this.ngayNCModel.getDate()));
        this.countDate = time / (1000 * 3600 * 24);
      }
    }
    if($('#ngayXC').first().val() == 'Invalid date') {
      this.ngayXCChange = null;
      this.countDate = 0;
    }
}

checkDateTuNgay($event,i) {
  this.tuNgayModel = $event;
    if (this.tuNgayModel != null && this.denNgayModel != null) {
      if (this.tuNgayModel > this.denNgayModel) {
        $('#tuNgay'+i).val(null)
        this.alert.warn("Vui lòng nhập Từ ngày nhỏ hơn Đến ngày")
        $('#tuNgay'+i).focus()
      } else {
        this.showEditable = true;
      }
    }
}

checkDateDenNgay($event,i) {
  this.denNgayModel = $event;
    if (this.tuNgayModel != null && this.denNgayModel != null) {
      if (this.tuNgayModel > this.denNgayModel) {
        $('#denNgay'+i).val(null)
        this.alert.warn("Vui lòng nhập Đến ngày lớn hơn Từ ngày")
        $('#denNgay'+i).focus()
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


