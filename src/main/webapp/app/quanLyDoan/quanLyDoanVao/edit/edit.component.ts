import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DelegationIn, IDelegationIn } from '../doanVao.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesManagementService } from '../service/categories-management.service';
import { FileUploadVM, IFileUploadVM } from '../../file.model';
import * as fileSaver from 'file-saver';
import { ILanhDao } from '../lanhDao.model';
import { IDiaPhuong } from '../diaPhuong.model';
import { AlertService } from 'app/core/util/alert.service';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import moment from 'moment';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { check } from 'prettier';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const delegationInTemplate = {} as IDelegationIn;
const lanhDaoTemplate = {} as ILanhDao;
const diaPhuongTemplate = {} as IDiaPhuong;
const fileTemplate = {} as IFileUploadVM;
const listFile = new FormArray([]);
const lanhDao = new FormArray([]);
const diaPhuong = new FormArray([]);
const newDelegationIn: IDelegationIn = {

} as IDelegationIn;

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
export class DoanVaoEditComponent implements OnInit {
  doanVao: DelegationIn | null = null;
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
  citems: User[] | null = null;
  countDele: number = 0;
  tenQG: any;
  anNinhChecked: string;
  ngayNCModel: any;
  ngayXCModel: any;
  tuNgayModel: any
  denNgayModel: any
  countDate=0
  checkNameFile = true;
  nameFile: string[] = [];
  ngayNCChange:any;
  ngayXCChange:any;
  currentPath: string;
  editForm = new FormGroup({
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
    updatedBy: new FormControl(delegationInTemplate.updatedBy),
    createdDate: new FormControl(delegationInTemplate.createdDate),
    updatedDate: new FormControl(delegationInTemplate.updatedDate),
    jsonLanhDao: lanhDao,
    jsonHDTaiDP: diaPhuong,
    listDVFileVM: listFile,
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

  diaPhuongUp = new FormGroup({
    iD: new FormControl(diaPhuongTemplate.iD == null ? 0 : diaPhuongTemplate.iD),
    maHSDoan: new FormControl(diaPhuongTemplate.maHSDoan),
    diaPhuong: new FormControl(diaPhuongTemplate.diaPhuong),
    tuNgay: new FormControl(diaPhuongTemplate.tuNgay),
    denNgay: new FormControl(diaPhuongTemplate.denNgay),
  })
  constructor(
    private updateService: CategoriesManagementService, 
    private qGService: QuocgiavavunglanhthoService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private cdRef:ChangeDetectorRef,
    public alert: AlertServiceCheck,
    private navbarService: NavBarService) { }
  anNinh = [
    {
      id: 1,
      name: 'Cảnh sát dẫn đường',
      checked: false
    },
    {
      id: 2,
      name: 'Tiếp cận trưởng đoàn',
      checked: false
    },
    {
      id: 3,
      name: 'Xe y tế tháp tùng',
      checked: false
    },
    {
      id: 4,
      name: 'Xe y tế đón, tiễn',
      checked: false
    },
    {
      id: 5,
      name: 'Bác sĩ tháp tùng đi địa phương',
      checked: false
    },
  ];

  inputChecked(data: any) {
    let checked = false;
    //console.log(this.category.measurements[i].measurements);
    //console.log('data = ', data);
    for (let l = 0; l < this.anNinh.length; l++) {
      let temp = this.doanVao.anNinh.split(',');
      for (let index = 0; index < temp.length; index++) {
        if (temp[index] == data.id) {
          checked = true;
        }
      }
    }
    return checked;
  }
  ngOnInit(): void {
    window.onload;
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
      this.doanVao = result;
      this.editForm.reset;
      this.editForm = new FormGroup({
        maDoan: new FormControl(this.doanVao.maDoan),
        tenDoan: new FormControl(this.doanVao.tenDoan, {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        }),
        truongDoan: new FormControl(this.doanVao.truongDoan, {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        }),
        maQG: new FormControl(this.doanVao.maQG, {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        }),
        quocGia: new FormControl(this.doanVao.quocGia),
        mucDichHD: new FormControl(this.doanVao.mucDichHD, {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        }),
        ngayNC: new FormControl(this.doanVao.ngayNC, {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        }),
        ngayXC: new FormControl(this.doanVao.ngayXC),
        soNgay: new FormControl(this.doanVao.soNgay),
        noiLuuTru: new FormControl(this.doanVao.noiLuuTru),
        anNinh: new FormControl(this.doanVao.anNinh),
        ghiChu: new FormControl(this.doanVao.ghiChu),
        soLuongTV: new FormControl(this.doanVao.soLuongTV),
        listFile: new FormControl(this.doanVao.listFile),
        createdBy: new FormControl(this.doanVao.createdBy),
        updatedBy: new FormControl(this.doanVao.updatedBy),
        createdDate: new FormControl(this.doanVao.createdDate),
        updatedDate: new FormControl(this.doanVao.updatedDate),
        jsonLanhDao: lanhDao,
        jsonHDTaiDP: diaPhuong,
        listDVFileVM: listFile,
      })
      let temp = this.doanVao.anNinh.split(',');
      for (let l = 0; l < this.anNinh.length; l++) {
        for (let index = 0; index < temp.length; index++) {
          if (temp[index] == this.anNinh[l].id.toString()) {
            this.anNinh[l].checked = true;
          }
        }
      }
      listFile.clear();
      lanhDao.clear();
      diaPhuong.clear();

      for (let index = 0; index < this.doanVao.listDVFileVM.length; index++) {
        this.listfileUp = new FormGroup({
          id: new FormControl(this.doanVao.listDVFileVM[index].id),
          fileName: new FormControl(this.doanVao.listDVFileVM[index].fileName),
          maHSDoan: new FormControl(this.doanVao.listDVFileVM[index].maHSDoan),
          type: new FormControl(this.doanVao.listDVFileVM[index].type),
        })
        listFile.push(this.listfileUp)
      }


      for (let index = 0; index < this.doanVao.listLanhDao.length; index++) {
        this.lanhdaoUp = new FormGroup({
          iD: new FormControl(this.doanVao.listLanhDao[index].iD),
          maHSDoan: new FormControl(this.doanVao.listLanhDao[index].maHSDoan),
          hoTen: new FormControl(this.doanVao.listLanhDao[index].hoTen),
        })
        lanhDao.push(
          this.lanhdaoUp,
        );
      }

      for (let index = 0; index < this.doanVao.listHDTaiDP.length; index++) {
        this.diaPhuongUp = new FormGroup({
          iD: new FormControl(this.doanVao.listHDTaiDP[index].iD),
          maHSDoan: new FormControl(this.doanVao.listHDTaiDP[index].maHSDoan),
          diaPhuong: new FormControl(this.doanVao.listHDTaiDP[index].diaPhuong),
          tuNgay: new FormControl(this.doanVao.listHDTaiDP[index].tuNgay),
          denNgay: new FormControl(this.doanVao.listHDTaiDP[index].denNgay)
        })
        diaPhuong.push(
          this.diaPhuongUp,
        );
      }
      this.cdRef.detectChanges();
    });

    this.currentPath = this.router.url;
    console.log(this.currentPath)
    this.navbarService.getSubPath(this.currentPath, 'Sửa')
  }

  private onSuccessQG(qG: User[] | null, headers: HttpHeaders): void {
    this.citems = qG;
  }

  previousState(): void {
    window.history.back();
  }

  downloadFile(id: number, name: string) {
    this.updateService.downloadFile(id).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/json; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, name);
    }), (error: any) => console.log('Error downloading the file');
  }

  addTableHDTCDP() {
    (<FormArray>this.editForm.get('jsonHDTaiDP')).push(
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
    var delBtn_leng = (<FormArray>this.editForm.get('jsonHDTaiDP')).length
    if (delBtn_leng > 1) {
      var delBtn = confirm(" Bạn có muốn xóa không ?");
      if (delBtn == true) {
        (<FormArray>this.editForm.get('jsonHDTaiDP')).removeAt(index);
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

  deleteRowFile(index: number, id: number) {
    var delBtn = confirm(" Bạn có muốn xóa không ?");
    if (delBtn == true) {
      (<FormArray>this.editForm.get('listDVFileVM')).removeAt(index);
      this.doanVao.listDVFileVM.splice(index, 1);
      if (this.countDele == 0) {
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
    return (<FormArray>this.editForm.get('listDVFileVM')).controls;
  }


  get diaPhuongControls() {
    // a getter!
    return (<FormArray>this.editForm.get('jsonHDTaiDP')).controls;
  }


  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }

  createDV(): void {
    let userName: string = JSON.parse(sessionStorage.getItem('jhi-userName'))
    this.isSaving = true;
    const payload = new FormData();
    const createForm = this.editForm.value
    payload.append('maDoan', createForm.maDoan == null ? "" : createForm.maDoan.toString());
    payload.append('tenDoan', createForm.tenDoan == null ? "" : createForm.tenDoan);
    payload.append('truongDoan', createForm.truongDoan == null ? "" : createForm.truongDoan);
    payload.append('maQG', createForm.maQG == null ? "" : createForm.maQG);
    payload.append('quocGia', this.tenQG == null ? "" : this.tenQG);
    payload.append('mucDichHD', createForm.mucDichHD == null ? "" : createForm.mucDichHD);
    payload.append('ngayNC', $('#ngayNC').first().val());
    payload.append('ngayXC', $('#ngayXC').first().val());
    payload.append('soNgay', createForm.soNgay == null ? "" : createForm.soNgay.toString());
    payload.append('noiLuuTru', createForm.noiLuuTru == null ? "" : createForm.noiLuuTru);
    var t = this.anNinh.filter(opt => opt.checked).map(opt => opt);
    var count = 0;
    for (let i = 0; i < t.length; i++) {
      if (count == 0) {
        this.anNinhChecked = t[i].id.toString();
        count++;
      } else {
        this.anNinhChecked = this.anNinhChecked + "," + t[i].id.toString();
      }
    }
    payload.append('anNinh', this.anNinhChecked == null ? "" : this.anNinhChecked);
    payload.append('ghiChu', createForm.ghiChu == null ? "" : createForm.ghiChu);
    payload.append('soLuongTV', createForm.soLuongTV == null ? "" : createForm.soLuongTV.toString());
    payload.append('createdBy', createForm.createdBy == null ? "" : createForm.createdBy);
    payload.append('updatedBy', userName);
    payload.append('createdDate', createForm.createdDate == null ? "" : createForm.createdDate.toString());
    payload.append('updatedDate', createForm.updatedDate == null ? "" : createForm.updatedDate.toString());
    for (let i = 0; i < this.fileList.length; i++) {
      console.log('filetesst' + this.fileList[i]);
      // this.selectedFile = this.lstUploadedFiles[i];
      // console.log('lưu' + this.lstUploadedFiles[i]);
      payload.append('listFile', this.fileList[i]);
      // payload.append('addressProofDoc', this.selectedFile[i]);
    }
    if (createForm.jsonLanhDao.length > 0) {
      payload.append('jsonLanhDao', JSON.stringify(createForm.jsonLanhDao));
    }
    for (let index = 0; index < createForm.jsonHDTaiDP.length; index++) {
      createForm.jsonHDTaiDP[index].tuNgay = $('#tuNgay'+index).first().val();
      createForm.jsonHDTaiDP[index].denNgay = $('#denNgay'+index).first().val();
    }
    if (createForm.jsonHDTaiDP.length > 0) {
      payload.append('jsonHDTaiDP', JSON.stringify(createForm.jsonHDTaiDP));
    }
    payload.append('strLsFileDelete', this.strLsFileDelete);
    console.log(payload.getAll('listFile'));
    if (createForm.maDoan !== null) {
      this.updateService.update(payload).subscribe({
        next: (response) => {
          this.alert.success('Cập nhật thành công thông tin đoàn');
          this.redirectTo('/doanVao/quanLyDoanVao');
        }, error: response => {
          this.alert.warn(" Cập nhật không thành công thông tin đoàn! ");
        }
      });
    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status != 200) {
      this.error = true;
    } else {
      this.error = false;
    }
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
      this.ngayNCChange = null;
      this.alert.warn("Vui lòng nhập ngày nhập cảnh theo định dạng DD/MM/YYYY")
      this.editForm.controls['soNgay'].setValue(0);
      $('#ngayNC').focus
    }
  }

  isInvalidDateNgayXC(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      event.target.value = null
      this.ngayXCChange = null;
      this.alert.warn("Vui lòng nhập ngày xuất cảnh theo định dạng DD/MM/YYYY")
      this.editForm.controls['soNgay'].setValue(0);
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
          this.editForm.controls['soNgay'].setValue(0);
          this.ngayNCChange = null;
          $('#ngayNC').focus()
        } else {
          const time = Math.floor(Date.UTC(this.ngayXCModel.getFullYear(), this.ngayXCModel.getMonth(), this.ngayXCModel.getDate()) - Date.UTC(this.ngayNCModel.getFullYear(), this.ngayNCModel.getMonth(), this.ngayNCModel.getDate()));
          this.editForm.controls['soNgay'].setValue(time / (1000 * 3600 * 24));
        }
      } else {
        this.editForm.controls['soNgay'].setValue(0);
      }
  }
  
  checkDateNgayXC($event) {
    this.ngayXCModel = $event;
      if (this.ngayNCModel != null && this.ngayXCModel != null) {
        if (this.ngayNCModel > this.ngayXCModel) {
          this.alert.warn("Vui lòng nhập Ngày xuất cảnh lớn hơn Ngày nhập cảnh")
          this.editForm.controls['soNgay'].setValue(0);
          this.ngayXCChange = null;
          $('#ngayXC').focus()
        } else {
          const time = Math.floor(Date.UTC(this.ngayXCModel.getFullYear(), this.ngayXCModel.getMonth(), this.ngayXCModel.getDate()) - Date.UTC(this.ngayNCModel.getFullYear(), this.ngayNCModel.getMonth(), this.ngayNCModel.getDate()));
          this.editForm.controls['soNgay'].setValue(time / (1000 * 3600 * 24));
        }
      } else {
        this.editForm.controls['soNgay'].setValue(0);
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
        this.tuNgayModel = null
        this.denNgayModel = null
      }
    } else {
   
      if(this.tuNgayModel > this.denNgayModel) {
        $('#tuNgay'+i).val(null)
        this.alert.warn("Vui lòng nhập Từ ngày nhỏ hơn Đến ngày")
        $('#tuNgay'+i).focus()
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
        this.tuNgayModel = null
        this.denNgayModel = null
      }
    } else {
      if(this.denNgayModel < this.tuNgayModel) {
        $('#denNgay'+i).val(null)
        this.alert.warn("Vui lòng nhập Đến ngày lớn hơn Từ ngày")
        $('#denNgay'+i).focus()
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