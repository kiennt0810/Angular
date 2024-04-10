import { ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IQuanLyTV, QuanLyTV } from '../quanLyTV.model';
import { QuanLyTVService } from '../service/quanLyTV.service';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IFileUploadVM } from 'app/quanLyDoan/file.model';
import { AlertService } from 'app/core/util/alert.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import * as fileSaver from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment';
import { DelegationIn } from 'app/quanLyDoan/quanLyDoanVao/doanVao.model';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { isBuffer } from 'util';

const quanLyTVTemp = {} as IQuanLyTV;
const fileUploadVM = {} as IFileUploadVM;
const listTVFileVM = new FormArray([]);



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
  templateUrl: './edit.component.html',
  styleUrls: ['../../../create.component.scss', './edit.component.scss'],
})

export class TvEditComponent implements OnInit {
  thanhVien: QuanLyTV | null = null;
  tTinDoan: DelegationIn | null = null;
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
  inputFieldValue;
  tableData: any[] = [];
  success = false;
  errorPassportExists = false;
  error = false;
  countDele: number = 0;
  strLsFileDelete: string;
  qGSelect: string;
  citems: any;
  checkNameFile = true;
  nameFile: string[] = [];
  ngayNCModel: any;
  ngayXCModel: any;
  ngayHL: any;
  ngayCap: any;
  gioiTinhSave: string;
  currentPath: string;
  fileImg = null;
  isWarningNS = false;
  isWarningNC =  false;
  isWarningHL =  false;
  isWarningNCTT =  false;
  isWarningNNC =  false;
  isWarningNXC =  false;
  idImageLoad: any;
  dSThanhVienDoan = new FormArray([]);
  ckSoTT = false;
  editForm = new FormGroup({
    soTT: new FormControl(quanLyTVTemp.soTT),
    ckSoTT: new FormControl(this.ckSoTT),
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
    gioiTinh: new FormControl(quanLyTVTemp.gioiTinh ? '1' : '0'),
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
    fileHC: new FormControl(this.fileImg),
    listTVFileVM: listTVFileVM,
  });

  listfileUp = new FormGroup({
    id: new FormControl(fileUploadVM.id),
    fileName: new FormControl(fileUploadVM.fileName),
    maHSDoan: new FormControl(fileUploadVM.maHSDoan),
    type: new FormControl(fileUploadVM.type),
  })

  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = "";
  editFile: boolean = true;
  removeUpload: boolean = false;

  uploadFileIMG(event) {
    let reader = new FileReader(); // HTML5 FileReader API
    this.fileImg = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(this.fileImg);
      if(this.idImageLoad != null) {
        if(this.countDele == 0) {
          this.countDele++;
          this.strLsFileDelete = this.idImageLoad;
        } else {
          this.countDele++;
          this.strLsFileDelete = this.strLsFileDelete + ',' + this.idImageLoad;
        }
        
      }
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
    public alert: AlertServiceCheck,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private navbarService: NavBarService) {
  }


  ngOnInit(): void {
    this.currentPath = this.router.url;
    console.log(this.currentPath)
    this.navbarService.getSubPath(this.currentPath, 'Sửa');
    this.qGService
      .getAll()
      .subscribe({
        next: (res: HttpResponse<User[]>) => {
          this.onSuccessQG(res.body, res.headers);
        },
      });
    console.log(this.route.snapshot.params.maTV);
    const id = this.route.snapshot.params.maTV;
    this.totalFileSize = 0;
    this.quanLyTVService.getCurrentData(id).subscribe((result) => {
      this.thanhVien = result;
      this.tTinDoan = this.thanhVien.dvHoSoVM;
      this.editForm.reset;
      if(this.thanhVien.gioiTinh == null) {
        this.gioiTinhSave = ""
      } else if(this.thanhVien.gioiTinh == true) {
        this.gioiTinhSave = "1"
      } else {
        this.gioiTinhSave = "0"
      }
      this.editForm = new FormGroup({
        soTT: new FormControl(this.thanhVien.soTT),
        ckSoTT: new FormControl(this.ckSoTT),
        maTV: new FormControl(this.thanhVien.maTV),
        maHSDoan: new FormControl(this.thanhVien.maHSDoan),
        tenHSDoan: new FormControl(this.thanhVien.tenHSDoan),
        coQuan: new FormControl(this.thanhVien.coQuan),
        chucVu: new FormControl(this.thanhVien.chucVu),
        hoTen: new FormControl(this.thanhVien.hoTen, {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        }),
        hoTenPA: new FormControl(this.thanhVien.hoTenPA),
        gioiTinh: new FormControl(this.gioiTinhSave),
        ngaySinh: new FormControl(this.thanhVien.ngaySinh),
        maQG: new FormControl(this.thanhVien.maQG, {
          nonNullable: true,
          validators: [
            Validators.required,
          ],
        }),
        quocGia: new FormControl(this.thanhVien.quocGia),
        noiLuuTru: new FormControl(this.thanhVien.noiLuuTru),
        ngayNC: new FormControl(this.thanhVien.ngayNC),
        ngayXC: new FormControl(this.thanhVien.ngayXC),
        tinhTrangSK: new FormControl(this.thanhVien.tinhTrangSK),
        tangPham: new FormControl(this.thanhVien.tangPham),
        soHoChieu: new FormControl(this.thanhVien.soHoChieu),
        hC_NgayCap: new FormControl(this.thanhVien.hC_NgayCap),
        hC_NgayHL: new FormControl(this.thanhVien.hC_NgayHL),
        hC_Loai: new FormControl(this.thanhVien.hC_Loai),
        hC_SoThiThuc: new FormControl(this.thanhVien.hC_SoThiThuc),
        hC_NgayCapTT: new FormControl(this.thanhVien.hC_NgayCapTT),
        listFile: new FormControl(this.thanhVien.listFile),
        fileHoChieu: new FormControl(this.thanhVien.fileHoChieu),
        strLsFileDelete: new FormControl(this.thanhVien.strLsFileDelete),
        fileUpList: new FormControl(this.thanhVien.fileUpList),
        fileHC: new FormControl(this.fileImg),
        listTVFileVM: listTVFileVM,
      })
      for (let i = 0; i < result.listTVFileVM.length; i++) {
        if (result.listTVFileVM[i].type == 0) {
          this.downloadImg(result.listTVFileVM[i].id);
        }
      }
      listTVFileVM.clear();
      for (let index = 0; index < this.thanhVien.listTVFileVM.length; index++) {
        this.listfileUp = new FormGroup({
          id: new FormControl(this.thanhVien.listTVFileVM[index].id),
          fileName: new FormControl(this.thanhVien.listTVFileVM[index].fileName),
          maHSDoan: new FormControl(this.thanhVien.listTVFileVM[index].maHSDoan),
          type: new FormControl(this.thanhVien.listTVFileVM[index].type),
        })
        listTVFileVM.push(this.listfileUp)
      }

      
    this.quanLyTVService.getLsTVEdit(this.thanhVien.maHSDoan == null ? "" : this.thanhVien.maHSDoan).subscribe((resultTV) => {
      console.log(resultTV);
      for (let index = 0; index < resultTV.length; index++) {
        let tTinTV = new FormGroup({
          soTT: new FormControl(resultTV[index].soTT),
          maTV: new FormControl(resultTV[index].maTV),
        })
        this.dSThanhVienDoan.push(tTinTV);
      }
    });
    });


    
  }

  private onSuccessQG(qG: User[] | null, headers: HttpHeaders): void {
    this.citems = qG;
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
  onSelected() {
    this.selectedTeam = this.gioiTinh.nativeElement.value
    if (this.selectedTeam != "") {
      this.gioiTinhChoose = this.selectedTeam == '1' ? true : false;
    };
  }

  downloadFile(id: number, name: string) {
    this.quanLyTVService.downloadFile(id).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/json; charset=utf-8' });
      // const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, name);
    }), (error: any) => console.log('Error downloading the file');
  }

  imageEditUrl: any;
  downloadImg(id: number) {
    this.quanLyTVService.downloadFile(id).subscribe((data: Blob) => {
      let objectURL = URL.createObjectURL(data);
      this.imageEditUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.idImageLoad = id;
    }), (error: any) => console.log('Error downloading the file');
  }

  deleteRowFile(index: number, id: number) {
    var delBtn = confirm(" Bạn có muốn xóa không ?");
    if (delBtn == true) {
      (<FormArray>this.editForm.get('listTVFileVM')).removeAt(index);
      this.thanhVien.listTVFileVM.splice(index,1);
      if(this.countDele == 0){
        this.strLsFileDelete = id.toString();
      } else {
        this.strLsFileDelete = this.strLsFileDelete + ',' + id.toString();
      }
      this.countDele = this.countDele + 1;
    }
  }

  get listFileControls() {
    // a getter!
    return (<FormArray>this.editForm.get('listTVFileVM')).controls;
  }
  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([uri])
    });
  }

  updateTV(): void {
    let userName: string = JSON.parse(sessionStorage.getItem('jhi-userName'))
    this.isSaving = true;
    const payload = new FormData();
    // for (let index = 0; index < this.dSThanhVienDoanControls.length; index++) {
    const editForm = this.editForm.value;
    if( this.dSThanhVienDoan.length > 0) {
      for(let i = 0; i <  this.dSThanhVienDoan.length; i++) {
        if(editForm.maTV == this. dSThanhVienDoan.value[i].maTV) {
          if(editForm.soTT !=  this.dSThanhVienDoan.value[i].soTT) {
            for(let j = 0; j <  this.dSThanhVienDoan.length; j++) {
              if(editForm.soTT ==  this.dSThanhVienDoan.value[j].soTT)
                this.ckSoTT = true;
            }
          }
        }
      }
    }
    
    if(this.ckSoTT == true) {
      var editBtn = confirm(" Số thứ tự này đã tồn tại bạn có muốn ghi đè?");
      if (editBtn == true) {
        this.isSaving = true;
      } else {
        this.isSaving = false;
      }
    }
    if (this.isSaving == true) {
      payload.append('SoTT', editForm.soTT == null ? "" : editForm.soTT.toString());
      payload.append('ckSoTT', this.ckSoTT == true ? "true" : "false");
      payload.append('maTV', editForm.maTV == null ? "" : editForm.maTV);
      payload.append('maHSDoan', editForm.maHSDoan == null ? "" : editForm.maHSDoan);
      payload.append('tenHSDoan', editForm.tenHSDoan == null ? "" : editForm.tenHSDoan);
      payload.append('coQuan', editForm.coQuan == null ? "" : editForm.coQuan);
      payload.append('chucVu', editForm.chucVu == null ? "" : editForm.chucVu);
      payload.append('hoTen', editForm.hoTen == null ? "" : editForm.hoTen);
      payload.append('hoTenPA', editForm.hoTenPA == null ? "" : editForm.hoTenPA);
      if (editForm.gioiTinh == "null") {
        this.gioiTinhSave = "";
      } else if (editForm.gioiTinh == '1') {
        this.gioiTinhSave = "true";
      } else if (editForm.gioiTinh == '0') {
        this.gioiTinhSave = "false";
      }
      payload.append('gioiTinh', this.gioiTinhSave);
      payload.append('ngaySinh', $('#ngaySinh').first().val() == null ? "" : $('#ngaySinh').first().val());
      payload.append('maQG', editForm.maQG == null ? "" : editForm.maQG);
      payload.append('noiLuuTru', editForm.noiLuuTru == null ? "" : editForm.noiLuuTru);
      payload.append('ngayNC', $('#ngayNC').first().val() == null ? "" : $('#ngayNC').first().val());
      payload.append('ngayXC', $('#ngayXC').first().val() == null ? "" : $('#ngayXC').first().val());
      payload.append('tinhTrangSK', editForm.tinhTrangSK == null ? "" : editForm.tinhTrangSK);
      payload.append('tangPham', editForm.tangPham == null ? "" : editForm.tangPham);
      payload.append('soHoChieu', editForm.soHoChieu == null ? "" : editForm.soHoChieu);
      payload.append('hC_NgayCap', $('#hC_NgayCap').first().val() == null ? "" : $('#hC_NgayCap').first().val());
      payload.append('hC_NgayHL', $('#hC_NgayHL').first().val() == null ? "" : $('#hC_NgayHL').first().val());
      payload.append('hC_Loai', editForm.hC_Loai == null ? "" : editForm.hC_Loai);
      payload.append('hC_SoThiThuc', editForm.hC_SoThiThuc == null ? "" : editForm.hC_SoThiThuc);
      payload.append('hC_NgayCapTT', $('#hC_NgayCapTT').first().val() == null ? "" : $('#hC_NgayCapTT').first().val());
      payload.append('updatedBy', userName)
      if (this.fileList != null) {
        for (let i = 0; i < this.fileList.length; i++) {
          payload.append('listFile', this.fileList[i]);
        }
      }
      payload.append('listFile', this.fileImg)
      if (this.fileImg != null) {
        payload.append('fileHoChieu', this.fileImg.name)
      }
      payload.append('strLsFileDelete', this.strLsFileDelete);
      console.log(payload.getAll('listFile'));
      if ($('#ngaySinh').first().val() != null)
        if (editForm.hoTen !== null) {
          this.quanLyTVService.update(payload).subscribe({
            next: (response) => {
              this.onSuccess()
            }, error: response => {
              this.alert.error('Cập nhật thông tin không thành công');
            }
          });
        }
      // }
    }
  }

  back() {
    window.history.go(-1)
  }

  private onSuccess() {
    this.alert.success('Cập nhật thông tin thành công');
    this.previousState()
  }

  previousState(): void {
    window.history.back();
  }

  handleChange($event) {
    let index = $event.target.selectedIndex - 1;
    if (index > 0) {
      this.qGSelect = this.citems[index].ten;
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
}
