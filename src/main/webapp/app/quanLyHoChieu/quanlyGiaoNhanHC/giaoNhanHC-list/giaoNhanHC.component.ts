import { Component, Injectable, Injector, OnInit } from '@angular/core';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT } from 'app/config/navigation.constants';
import { GiaoNhanHCService } from '../service/giaoNhanHC.service';
import { GiaoNhanHC } from '../giaoNhanHC.model';
import { DeleteGNHcDialogComponent } from '../giaoNhanHC-delete/giaoNhanHC-delete.component';

import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavbarComponent } from 'app/layouts/navbar/navbar.component';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { Passport } from 'app/quanlydanhmuc/loaihochieu/loaihochieu.model';
import { PassportService } from 'app/quanlydanhmuc/loaihochieu/loaihochieu.service';
import { SessionStorageService } from 'ngx-webstorage';

declare var $: any;
@Component({
  selector: 'jhi-giaoNhanHC-mgmt',
  templateUrl: './giaoNhanHC.component.html',
  styleUrls: ['./giaoNhanHC.component.scss'],
})
export class GiaoNhanHCComponent implements OnInit {
  giaoNhanHCs: GiaoNhanHC[] | null = null;
  SearchItems: GiaoNhanHC[] | null = null;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  nameModule = 'hộ chiếu';
  totalPage = 0;
  passports: Passport[] | null = null;
  showWarning1 = false;
  showWarning2 = false;
  checkLoadList = false;
  currentPath: string;
  roles: string;
  checkAuth = false;
  fullAuth = false;
  userName: string = this.sessionStorageService.retrieve('userName');
  constructor(
    private GiaoNhanHCService: GiaoNhanHCService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private passportService: PassportService,
    private alert: AlertServiceCheck,
    private injector: Injector,
    private NavbarService: NavBarService,
    private sessionStorageService: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.handleNavigation();
    this.loadAllPassport();
    this.currentPath = this.router.url;
    this.NavbarService.getPath(this.currentPath);
    this.roles = this.sessionStorageService.retrieve('roles');
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i] == '09000') {
        this.checkAuth = true;
      }
      if (this.roles[i] == '09001') {
        this.fullAuth = true;
      }
    }
  }


  loadAllPassport(): void {
    this.passportService.getLstPP().subscribe({
      next: (res: HttpResponse<Passport[]>) => {
        this.onSuccessLstPassport(res.body);
      }
    });
  }
  private onSuccessLstPassport(passport: Passport[] | null): void {
    this.passports = passport;
    for (let i = 0; i <= this.passports.length; i++) {
      if (this.passports[i]?.tinhTrang == false) {
        const index: number = this.passports.indexOf(this.passports[i]);
        i--;
        this.passports.splice(index, 1);
      }
    }
  }

  loadAll(): void {
    this.isLoading = true;
    this.GiaoNhanHCService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<GiaoNhanHC[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
        },
        error: () => (this.isLoading = false),
      });


  }
  isInvalidDate1(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY!');
      this.showWarning1 = true
      event.target.value = null
    } else {
      this.showWarning1 = false
    }
  }
  isInvalidDate2(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY!');
      this.showWarning2 = true
      event.target.value = null
    } else {
      this.showWarning2 = false
    }
  }

  onEditClick(id: number) {
    const element = this.giaoNhanHCs.find((p) => { return p.id === id });

  }
  fields = {
    loaiHC: null,
    hoTen: '',
    chucVu: '',
    ghcNguoiGiao: '',
    ghcNguoiNhan: '',
    coQuan: '',
    ghcThoiGian: '',
    nhcThoiGian: '',
    nhcNguoiGiao: '',
    nhcNguoiNhan: '',
  };
  filter = {};

  updateFilters() {
    const dk = sessionStorage.getItem('dktk')
    if (dk && dk !== "{}") {
      this.SearchItems = this.giaoNhanHCs;
      this.filter = JSON.parse(dk);
      this.fields = JSON.parse(dk);
      this.SearchItems = this.transform(this.SearchItems, this.filter);
    this.totalItems = Number(this.SearchItems.length);
    if (this.totalItems <= 0) {
      this.checkLoadList = true;
    }
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    this.page = 1;
    } else {
      this.checkLoadList = false;
      if (this.fields.loaiHC == '') {
        $('#loaiHC').val() == '';
      }
      if (this.fields.ghcThoiGian != "" && this.fields.ghcThoiGian != "Invalid date" && this.fields.ghcThoiGian != undefined) {
        this.fields.ghcThoiGian = $('#dateTgGiao').val();
      } else {
        this.fields.ghcThoiGian = "";
      }
  
      if (this.fields.nhcThoiGian != "" && this.fields.nhcThoiGian != "Invalid date" && this.fields.nhcThoiGian != undefined) {
        this.fields.nhcThoiGian = $('#dateTgNhan').val();
      } else {
        this.fields.nhcThoiGian = "";
      }
      Object.keys(this.fields).forEach((key) => {
        if (key !== 'loaiHC') {
          this.fields[key] = this.fields[key].trim();
        }
      });
      Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
      this.SearchItems = this.giaoNhanHCs;
      this.filter = Object.assign({}, this.fields);
      this.SearchItems = this.transform(this.SearchItems, this.filter);
      this.totalItems = Number(this.SearchItems.length);
      if (this.totalItems <= 0) {
        this.checkLoadList = true;
      }
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
      this.page = 1;
    }
  }

  search() {
    sessionStorage.removeItem('dktk')
    this.checkLoadList = false;
    if (this.fields.loaiHC == '') {
      $('#loaiHC').val() == '';
    }
    if (this.fields.ghcThoiGian != "" && this.fields.ghcThoiGian != "Invalid date" && this.fields.ghcThoiGian != undefined) {
      this.fields.ghcThoiGian = $('#dateTgGiao').val();
    } else {
      this.fields.ghcThoiGian = "";
    }

    if (this.fields.nhcThoiGian != "" && this.fields.nhcThoiGian != "Invalid date" && this.fields.nhcThoiGian != undefined) {
      this.fields.nhcThoiGian = $('#dateTgNhan').val();
    } else {
      this.fields.nhcThoiGian = "";
    }
    Object.keys(this.fields).forEach((key) => {
      if (key !== 'loaiHC') {
        this.fields[key] = this.fields[key].trim();
      }
    });
    Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
    this.SearchItems = this.giaoNhanHCs;
    this.filter = Object.assign({}, this.fields);
    this.SearchItems = this.transform(this.SearchItems, this.filter);
    this.totalItems = Number(this.SearchItems.length);
    if (this.totalItems <= 0) {
      this.checkLoadList = true;
    }
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    this.page = 1;
  }

  transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
    if (Object.keys(filter).length == 0) return items;
    let filterKeys = Object.keys(filter);
    let dk = JSON.stringify(this.filter);
    return items.filter(item => {
      return filterKeys.every(keyName => {
        if (keyName === 'loaiHC' && (filter[keyName] === null || filter[keyName] === 'null') ) {
          filter[keyName] = '';
          delete this.filter[keyName]
          sessionStorage.setItem('dktk', dk);
          return true;
        } else {
          sessionStorage.setItem('dktk', dk);
          return (
            new RegExp(filter[keyName], 'gi').test(item[keyName]) ||
            filter[keyName] === ''
          );
        }
      });
    });
  }

  deleteCondition() {
    this.fields = {
      loaiHC: null,
      hoTen: '',
      chucVu: '',
      ghcNguoiGiao: '',
      ghcNguoiNhan: '',
      coQuan: '',
      ghcThoiGian: '',
      nhcThoiGian: '',
      nhcNguoiGiao: '',
      nhcNguoiNhan: '',
    };
  }

  transition(): void {
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        sort: `${this.predicate},${this.ascending ? ASC : DESC}`,
      },
    });
  }


  private handleNavigation(): void {
    const page = this.page;
    this.page = +(page ?? 1);
    this.loadAll();
  }

  private sort(): string[] {
    const result = [`${this.predicate},${this.ascending ? ASC : DESC}`];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }
  // Number(headers.get('X-Total-Count'));
  private onSuccess(hoChieu: GiaoNhanHC[] | null, headers: HttpHeaders): void {
    this.totalItems = hoChieu.length;

    for (let i = 0; i < hoChieu.length; i++) {
      if (i != 0) {
        hoChieu[0].stt = 1;
        hoChieu[i].stt = hoChieu[i - 1].stt + 1;
      }
      hoChieu[i].hoTen = hoChieu[i].hcNgoaiGiaoVM.hoTen;
      hoChieu[i].chucVu = hoChieu[i].hcNgoaiGiaoVM.chucVu;
      hoChieu[i].coQuan = hoChieu[i].hcNgoaiGiaoVM.coQuan;
      hoChieu[i].loaiHC = hoChieu[i].hcNgoaiGiaoVM.loaiHC;
      if (hoChieu[i].ghcNguoiGiao == 'null') {
        hoChieu[i].ghcNguoiGiao = '';
      }
      if (hoChieu[i].ghcNguoiNhan == 'null') {
        hoChieu[i].ghcNguoiNhan = '';
      }
      if (hoChieu[i].nhcNguoiGiao == 'null') {
        hoChieu[i].nhcNguoiGiao = '';
      }
      if (hoChieu[i].nhcNguoiNhan == 'null') {
        hoChieu[i].nhcNguoiNhan = '';
      }
      if (hoChieu[i].chucVu == 'null') {
        hoChieu[i].chucVu = '';
      }
      if (hoChieu[i].coQuan == 'null') {
        hoChieu[i].coQuan = '';
      }
    }
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    this.giaoNhanHCs = hoChieu;
    this.SearchItems = this.giaoNhanHCs;
    this.checkLoadList = false;
    this.updateFilters();
  }

  deleteGNHC(hoChieu: GiaoNhanHC): void {
    if (this.fullAuth == true) {
      const modalRef = this.modalService.open(DeleteGNHcDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.hoChieu = hoChieu;
      modalRef.closed.subscribe(reason => {
        if (reason === 'deleted') {
          this.loadAll();
          this.alert.success('Xóa thành công');
        }
      });
    } else if (String(hoChieu.createdBy) == String(this.userName)) {
      const modalRef = this.modalService.open(DeleteGNHcDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.hoChieu = hoChieu;
      modalRef.closed.subscribe(reason => {
        if (reason === 'deleted') {
          this.loadAll();
          this.alert.success('Xóa thành công');
        }
      });
    } else {
      this.alert.warn("Bạn chỉ được xóa dữ liệu do chính mình tạo ra!");
    }
  }

  editGNHC(hoChieu: GiaoNhanHC): void {
    if (this.fullAuth == true) {
      this.router.navigate(['/HoChieu/GiaoNhanHC/editGNHChieu', hoChieu.id]);
    } else if (String(hoChieu.createdBy) == String(this.userName)) {
      this.router.navigate(['/HoChieu/GiaoNhanHC/editGNHChieu', hoChieu.id]);
    } else {
      this.alert.warn('Bạn chỉ được sửa dữ liệu do chính mình tạo ra!');
    }
  }
}
