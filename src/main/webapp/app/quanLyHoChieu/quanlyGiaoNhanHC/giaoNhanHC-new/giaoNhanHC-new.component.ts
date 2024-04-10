import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbCalendar, NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgElement } from '@angular/elements';
import { GiaoNhanHCService } from '../service/giaoNhanHC.service';
import { AlertService } from 'app/core/util/alert.service';
import { Router } from '@angular/router';
import { GiaoNhanHC } from '../giaoNhanHC.model';
import { HChieuNGService } from 'app/quanLyHoChieu/quanlyHCNgoaiGiao/service/hoCNgoaiGiao.service';
import { SoHCSearchComponent } from '../popup/popup.component';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { SessionStorageService } from 'ngx-webstorage';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

const GNHCTemplate = {} as GiaoNhanHC;
declare var $: any;
@Component({
  selector: 'jhi-hoCNgoaiGiao',
  templateUrl: './giaoNhanHC-new.component.html',
  styleUrls: ['./GNHC-new.component.scss'],
})
export class newGNHCComponent implements OnInit {
  success = false;
  errorPassportExists = false;
  error = false;
  soHCPopup: string;
  loaiHCPopup: string;
  hoTenPopup: string;
  chucVuPopup: string;
  coQuanPopup: string;
  showWarning1 = false;
  showWarning2 = false;

  checkDouble = false;
  checkNullSoHC = false;
  checkKyTu = false;
  currentPath: string;

  GNHCForm = new FormGroup({
    hoTen: new FormControl(GNHCTemplate.hoTen),
    chucVu: new FormControl(GNHCTemplate.chucVu),
    coQuan: new FormControl(GNHCTemplate.coQuan),
    loaiHC: new FormControl(GNHCTemplate.loaiHC),
    soHoChieu: new FormControl(GNHCTemplate.soHoChieu, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    ghcThoiGian: new FormControl(GNHCTemplate.ghcThoiGian),
    ghcNguoiGiao: new FormControl(GNHCTemplate.ghcNguoiGiao),
    ghcNguoiNhan: new FormControl(GNHCTemplate.ghcNguoiNhan),
    nhcThoiGian: new FormControl(GNHCTemplate.nhcThoiGian),
    nhcNguoiGiao: new FormControl(GNHCTemplate.nhcNguoiGiao),
    nhcNguoiNhan: new FormControl(GNHCTemplate.nhcNguoiNhan),
  });

  constructor(
    private GiaoNhanHCService: GiaoNhanHCService,
    private toast: AlertService,
    private Service: HChieuNGService,
    private router: Router,
    private modalService: NgbModal,
    private alert: AlertServiceCheck,
    private sessionStorageService: SessionStorageService,
    private navbarService: NavBarService
  ) { }

  ngOnInit(): void {
    this.currentPath = this.router.url;
    console.log(this.currentPath)
    this.navbarService.getSubPath(this.currentPath, 'Thêm mới')
  }

  isInvalidDate1(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.showWarning1 = true;
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY!');
      event.target.value = null
    } else {
      this.showWarning1 = false
    }
  }
  isInvalidDate2(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.showWarning2 = true
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY!');
      event.target.value = null
    } else {
      this.showWarning2 = false
    }
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

  nameValidator(key: string) {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (key && nameRegexp.test(key)) {
      return true;
    } else {
      return false;
    }
  }

  compareDateHL(d1: string, d2: string) {
    let [day, month, year] = d1.split('/');
    const ngayGiao = new Date(+year, +month - 1, +day).getTime();
    let [day2, month2, year2] = d2.split('/');
    const ngayNhan = new Date(+year2, +month2 - 1, +day2).getTime();
    if (ngayGiao < ngayNhan) {
      return true;
    } else if (ngayGiao > ngayNhan) {
      return false;
    } else {
      return true;
    }
  };



  createGNHC(): void {
    const formData = new FormData();
    const create = this.GNHCForm.value;
    create.ghcThoiGian = $('#dateGiaoHc').first().val();
    create.nhcThoiGian = $('#dateNhanHc').first().val();
    create.soHoChieu = $('#soHoChieu').val();
    $('#soHoChieu').focus();
    let userName: string = this.sessionStorageService.retrieve('userName');

    if ($('#soHoChieu').val() == '') {
      this.alert.warn('Số hộ chiếu không được để trống!');
      $('#soHoChieu').focus();
    } else if (this.nameValidator(String($('#soHoChieu').val()))) {
      this.alert.warn('Số hộ chiếu không được chứa ký tự đặc biệt!');
      $('#soHoChieu').focus();
    } else if ((create.nhcThoiGian == null || create.nhcThoiGian == undefined || create.nhcThoiGian == '') && (create.ghcThoiGian == null || create.ghcThoiGian == undefined || create.ghcThoiGian == '')) {
      this.alert.warn('Phải nhập thông tin Giao hộ chiếu hoặc Nhận hộ chiếu!');
      $('#dateGiaoHc').focus();
    }
    else {
      if ((create.nhcThoiGian != null || create.nhcThoiGian != undefined || create.nhcThoiGian != '') && (create.ghcThoiGian == null || create.ghcThoiGian == undefined || create.ghcThoiGian == '')) {
        if (create.nhcNguoiGiao == null || create.nhcNguoiGiao == undefined || create.nhcNguoiGiao == '') {
          this.alert.warn('Người giao không được để trống!');
          $('#nhcNguoiGiao').focus();
        } else if (create.nhcNguoiNhan == null || create.nhcNguoiNhan == undefined || create.nhcNguoiNhan == '') {
          this.alert.warn('Người nhận không được để trống!');
          $('#nhcNguoiNhan').focus();
        } else {
          if (create.nhcNguoiGiao != null || create.nhcNguoiGiao != undefined || create.nhcNguoiGiao != '') {
            create.nhcNguoiGiao = $('#nhcNguoiGiao').val().trim();
          }
          if (create.nhcNguoiNhan != null || create.nhcNguoiNhan != undefined || create.nhcNguoiNhan != '') {
            create.nhcNguoiNhan = $('#nhcNguoiNhan').val().trim();
          }
          formData.append('GHCNguoiGiao', create.ghcNguoiGiao);
          formData.append('GHCNguoiNhan', create.ghcNguoiNhan);
          formData.append('GHCThoiGian', create.ghcThoiGian);
          formData.append('NHCNguoiGiao', create.nhcNguoiGiao);
          formData.append('NHCNguoiNhan', create.nhcNguoiNhan);
          formData.append('NHCThoiGian', create.nhcThoiGian);
          formData.append('SoHoChieu', create.soHoChieu.trim());
          formData.append('CreatedBy', userName);
          this.GiaoNhanHCService.create(formData).subscribe({ next: (response) => this.processSuscess(response), error: response => this.processError(response) });
        }
      } else if ((create.ghcThoiGian != null || create.ghcThoiGian != undefined || create.ghcThoiGian != '') && (create.nhcThoiGian == null || create.nhcThoiGian == undefined || create.nhcThoiGian == '')) {
        if (create.ghcNguoiGiao == null || create.ghcNguoiGiao == undefined || create.ghcNguoiGiao == '') {
          this.alert.warn('Người giao không được để trống!');
          $('#ghcNguoiGiao').focus();
        } else if (create.ghcNguoiNhan == null || create.ghcNguoiNhan == undefined || create.ghcNguoiNhan == '') {
          this.alert.warn('Người nhận không được để trống!');
          $('#ghcNguoiNhan').focus();
        } else {
          if (create.ghcNguoiGiao != null || create.ghcNguoiGiao != undefined || create.ghcNguoiGiao != '') {
            create.ghcNguoiGiao = $('#ghcNguoiGiao').val().trim();
          }
          if (create.ghcNguoiNhan != null || create.ghcNguoiNhan != undefined || create.ghcNguoiNhan != '') {
            create.ghcNguoiNhan = $('#ghcNguoiNhan').val().trim();
          }
          formData.append('GHCNguoiGiao', create.ghcNguoiGiao);
          formData.append('GHCNguoiNhan', create.ghcNguoiNhan);
          formData.append('GHCThoiGian', create.ghcThoiGian);
          formData.append('NHCNguoiGiao', create.nhcNguoiGiao);
          formData.append('NHCNguoiNhan', create.nhcNguoiNhan);
          formData.append('NHCThoiGian', create.nhcThoiGian);
          formData.append('SoHoChieu', create.soHoChieu.trim());
          formData.append('CreatedBy', userName);
          this.GiaoNhanHCService.create(formData).subscribe({ next: (response) => this.processSuscess(response), error: response => this.processError(response) });
        }
      } else if (create.ghcThoiGian != '' && create.nhcThoiGian != '') {
        if (!this.compareDateHL(create.ghcThoiGian, create.nhcThoiGian)) {
          this.alert.warn('Thời gian giao không được lớn hơn thời gian nhận!');
          $('#dateGiaoHc').focus();
        } 
        // else if (create.ghcNguoiGiao == null || create.ghcNguoiGiao == undefined || create.ghcNguoiGiao == '') {
        //   this.alert.warn('Người giao không được để trống!');
        //   $('#ghcNguoiGiao').focus();
        // } 
        // else if (create.ghcNguoiNhan == null || create.ghcNguoiNhan == undefined || create.ghcNguoiNhan == '') {
        //   this.alert.warn('Người nhận không được để trống!');
        //   $('#ghcNguoiNhan').focus();
        // } 
        // else if (create.nhcNguoiGiao == null || create.nhcNguoiGiao == undefined || create.nhcNguoiGiao == '') {
        //   this.alert.warn('Người giao không được để trống!');
        //   $('#nhcNguoiGiao').focus();
        // } 
        // else if (create.nhcNguoiNhan == null || create.nhcNguoiNhan == undefined || create.nhcNguoiNhan == '') {
        //   this.alert.warn('Người nhận không được để trống!');
        //   $('#nhcNguoiNhan').focus();
        // }  
        else {
          if (create.nhcNguoiGiao != null || create.nhcNguoiGiao != undefined || create.nhcNguoiGiao != '') {
            create.nhcNguoiGiao = $('#nhcNguoiGiao').val().trim();
          }
          if (create.nhcNguoiNhan != null || create.nhcNguoiNhan != undefined || create.nhcNguoiNhan != '') {
            create.nhcNguoiNhan = $('#nhcNguoiNhan').val().trim();
          }
          if (create.ghcNguoiGiao != null || create.ghcNguoiGiao != undefined || create.ghcNguoiGiao != '') {
            create.ghcNguoiGiao = $('#ghcNguoiGiao').val().trim();
          }
          if (create.ghcNguoiNhan != null || create.ghcNguoiNhan != undefined || create.ghcNguoiNhan != '') {
            create.ghcNguoiNhan = $('#ghcNguoiNhan').val().trim();
          }
          formData.append('GHCNguoiGiao', create.ghcNguoiGiao);
          formData.append('GHCNguoiNhan', create.ghcNguoiNhan);
          formData.append('GHCThoiGian', create.ghcThoiGian);
          formData.append('NHCNguoiGiao', create.nhcNguoiGiao);
          formData.append('NHCNguoiNhan', create.nhcNguoiNhan);
          formData.append('NHCThoiGian', create.nhcThoiGian);
          formData.append('SoHoChieu', create.soHoChieu.trim());
          formData.append('CreatedBy', userName);
          this.GiaoNhanHCService.create(formData).subscribe({ next: (response) => this.processSuscess(response), error: response => this.processError(response) });
        }
      }
    }

  }

  private processSuscess(response): void {
    console.log(response);
    if (Number(response.status) != 200) {
      //this.toast.addAlert({ message: 'Thêm mới không thành công', type: 'danger', toast: true, timeout: 1000 });
      this.alert.error('Thêm mới không thành công');
    } else {
      this.router.navigate(['/HoChieu/GiaoNhanHC']);
      this.alert.success('Thêm mới giao nhận hộ chiếu thành công');
      //this.toast.addAlert({ message: 'Thêm mới giao nhận hộ chiếu thành công', type: 'success', toast: true , timeout: 1000});

    }
  }

  checkSoHc(event): void {
    this.checkNullSoHC = false;
    this.checkKyTu = false;
    const create = this.GNHCForm.value;
    const soHC = event.target.value;
    if (soHC != '') {
      if (this.nameValidator(String(soHC))) {
        this.checkKyTu = true;
        this.GNHCForm = new FormGroup({
          hoTen: new FormControl(''),
          chucVu: new FormControl(''),
          coQuan: new FormControl(''),
          loaiHC: new FormControl(''),
          soHoChieu: new FormControl(''),
          ghcThoiGian: new FormControl(create.ghcThoiGian),
          ghcNguoiGiao: new FormControl(create.ghcNguoiGiao),
          ghcNguoiNhan: new FormControl(create.ghcNguoiNhan),
          nhcThoiGian: new FormControl(create.nhcThoiGian),
          nhcNguoiGiao: new FormControl(create.nhcNguoiGiao),
          nhcNguoiNhan: new FormControl(create.nhcNguoiNhan),
        });
        //this.alert.error('Số hộ chiếu không được chứa ký tự đặc biệt!');
      } else {
        this.Service.getCurrentDataCheckExist(soHC).subscribe({
          next: () => {
            this.processFillSoHC(soHC);
          },
          error: (response) => {
            this.processCheckSoHC(response.body, soHC);
          },
        });
      }
    } else {
      this.checkNullSoHC = true;
      this.GNHCForm = new FormGroup({
        hoTen: new FormControl(''),
        chucVu: new FormControl(''),
        coQuan: new FormControl(''),
        loaiHC: new FormControl(''),
        soHoChieu: new FormControl(''),
        ghcThoiGian: new FormControl(create.ghcThoiGian),
        ghcNguoiGiao: new FormControl(create.ghcNguoiGiao),
        ghcNguoiNhan: new FormControl(create.ghcNguoiNhan),
        nhcThoiGian: new FormControl(create.nhcThoiGian),
        nhcNguoiGiao: new FormControl(create.nhcNguoiGiao),
        nhcNguoiNhan: new FormControl(create.nhcNguoiNhan),
      });
      //this.alert.error('Số hộ chiếu không được để trống!');
      this.processFillSoHC(soHC);
    }
  }

  processFillSoHC(soHC): void {
    this.checkDouble = false;
    const create = this.GNHCForm.value;
    create.ghcThoiGian = $('#dateGiaoHc').first().val();
    create.nhcThoiGian = $('#dateNhanHc').first().val();
    this.Service.getCurrentGNHC(soHC).subscribe((result) => {
      this.GNHCForm = new FormGroup({
        hoTen: new FormControl(result['hoTen']),
        chucVu: new FormControl(result['chucVu'] == 'null' ? '' : result['chucVu']),
        coQuan: new FormControl(result['coQuan'] == 'null' ? '' : result['coQuan']),
        loaiHC: new FormControl(result['loaiHC']),
        soHoChieu: new FormControl(result['soHC']),
        ghcThoiGian: new FormControl(create.ghcThoiGian),
        ghcNguoiGiao: new FormControl(create.ghcNguoiGiao),
        ghcNguoiNhan: new FormControl(create.ghcNguoiNhan),
        nhcThoiGian: new FormControl(create.nhcThoiGian),
        nhcNguoiGiao: new FormControl(create.nhcNguoiGiao),
        nhcNguoiNhan: new FormControl(create.nhcNguoiNhan),
      });
    });
  }

  processCheckSoHC(response: HttpErrorResponse, soHC): void {
    this.checkDouble = false;
    if (String(response) == 'undefined') {
      const create = this.GNHCForm.value;
      this.checkDouble = true;
      this.GNHCForm = new FormGroup({
        hoTen: new FormControl(''),
        chucVu: new FormControl(''),
        coQuan: new FormControl(''),
        loaiHC: new FormControl(''),
        soHoChieu: new FormControl(soHC),
        ghcThoiGian: new FormControl(create.ghcThoiGian),
        ghcNguoiGiao: new FormControl(create.ghcNguoiGiao),
        ghcNguoiNhan: new FormControl(create.ghcNguoiNhan),
        nhcThoiGian: new FormControl(create.nhcThoiGian),
        nhcNguoiGiao: new FormControl(create.nhcNguoiGiao),
        nhcNguoiNhan: new FormControl(create.nhcNguoiNhan),
      })
      //this.alert.error('Số hộ chiếu không tồn tại!');
      //this.toast.addAlert({ message: 'Số hộ chiếu không tồn tại!', type: 'danger', toast: true , timeout: 1000});
    } else {
      this.checkDouble = false;
    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status !== 200) {
      this.alert.error('Thêm mới không thành công');
      //this.toast.addAlert({ message: 'Thêm mới không thành công', type: 'danger', toast: true });
    } else {
      this.router.navigate(['/HoChieu/GiaoNhanHC'])
      this.alert.success('Thêm mới giao nhận hộ chiếu thành công');
      //this.toast.addAlert({ message: 'Thêm mới hộ chiếu thành công', type: 'success', toast: true });

    }
  }

  previousState(): void {
    window.history.back();
  }

  popupSoHC() {
    let dialogRef = this.modalService.open(SoHCSearchComponent, {
      size: 'xl',
      centered: true,
    });
    dialogRef.result.then(
      result => {
        this.soHCPopup = result.soHC;
        this.loaiHCPopup = result.loaiHC;
        this.hoTenPopup = result.hoTen;
        this.chucVuPopup = result.chucVu == 'null' ? '' : result.chucVu;
        this.coQuanPopup = result.coQuan == 'null' ? '' : result.coQuan;
        this.checkDouble = false;
        this.checkNullSoHC = false;
        this.checkKyTu = false;
      },
      reason => {
        console.log('Dismissed');
      }
    );

  }

}
