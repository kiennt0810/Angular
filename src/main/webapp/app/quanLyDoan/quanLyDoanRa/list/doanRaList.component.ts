import { Component, Injectable, OnInit } from '@angular/core';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC } from 'app/config/navigation.constants';
import { Account } from 'app/core/auth/account.model';

import { formatDate } from '@angular/common';
import { DoanRa } from '../doanRa.model';
import { DoanRaService } from '../service/delegation-out.service';
import { DoanRaDeleteDialogComponent } from '../delete/delete-dialog.component';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from 'file-saver';
import { QGiaDen } from '../qGiaDen.model';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { QuanLyTV } from 'app/quanLyDoan/quanLyTVRa/quanLyTVRa.model';
import { QuanLyTVService } from 'app/quanLyDoan/quanLyTVRa/service/quanLyTVRa.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { SessionStorageService } from 'ngx-webstorage';
import { Dktk, IDktk } from '../dktk.model';

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

type objField = {};
declare var $: any;
@Component({
  selector: 'jhi-user-mgmt',
  templateUrl: './doanRaList.component.html',
  styleUrls: ['../../../income.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],

})

export class DoanRaComponent implements OnInit {
  currentAccount: Account | null = null;
  users: DoanRa[] | null = null;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  pageSize!: number;
  predicate!: string;
  ascending!: boolean;
  pitems: DoanRa[] | null = null;
  eitems: DoanRa[] | null = null;
  formatDateNC: boolean;
  formatDateXC: boolean;
  ptotalItems = 0;
  qGia: QGiaDen[] | null = null;
  qGiaList: any;
  sLuongTV: string[] | null = null;
  ExPrItem: DoanRa[] | null = null;
  totalPage = 0;
  quocGiaList: User[] | null = null;
  maDoanSearchTV: number;
  pageTV!: number;
  totalItemsTV = 0;
  qlyTV: QuanLyTV[] | null = null;
  ngayNCModel: any;
  ngayXCModel: any;
  quocGia: any;
  checkLoadList = false;
  roles: string;
  checkAuth = false;
  fullAuth = false;
  userName: string = this.sessionStorageService.retrieve('userName');
  fields = {
    maDoan: '',
    tenDoan: '',
    mucDichHD: '',
    quocGia: null,
    ngayNC: '',
    ngayXC: '',
    truongDoan: '',
    chucVu: '',
    nam: '',
  };

  dktk: Dktk = {
    maDoan: null,
    tenDoan: '',
    mucDichHD: '',
    maQG: null,
    ngayNC: '',
    ngayXC: '',
    truongDoan: '',
    chucVu: '',
    nam: null,
    page: null,
  };
  filter = {};
  currentPath: string;

  constructor(
    private userService: DoanRaService,
    private qGService: QuocgiavavunglanhthoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private alert: AlertServiceCheck,
    private qltvService: QuanLyTVService,
    private NavbarService: NavBarService,
    private sessionStorageService: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.page = params['page'];
      this.handleNavigation();
      // this.testAPI();
    })
    this.handleNavigation();
    this.qGService
      .getAll()
      .subscribe({
        next: (res: HttpResponse<User[]>) => {
          this.onSuccessQG(res.body, res.headers);
        },
      });
    
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

  private onSuccessQG(qG: User[] | null, headers: HttpHeaders): void {
    this.quocGiaList = qG;
  }

  deleteCondition(): void {

  }

  removevalue() {

  }

  testAPI() {
    this.dktk.page = this.page;
    this.userService.getByPage(this.dktk).subscribe({
      next: (res: HttpResponse<IDktk>) => {
        const result = res.body;
        console.log(result);
      }
    })
  }

  updateFilters() {
    const dk = sessionStorage.getItem('dktk')
    if (dk && dk !== "{}") {
      this.filter = JSON.parse(dk);
      this.fields = JSON.parse(dk);
      this.quocGia = this.fields.quocGia;
      if (this.fields.quocGia != null) {
        this.userService
          .query(this.fields.quocGia, {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
          })
          .subscribe({
            next: (res: HttpResponse<DoanRa[]>) => {
              this.isLoading = false;
              this.onSuccess(res.body, res.headers);
              this.fields.quocGia = '';
              this.ExPrItem = this.users;
              this.filter = Object.assign({}, this.fields);
              this.ExPrItem = this.transform(this.ExPrItem, this.filter);
              this.totalItems = Number(this.ExPrItem.length);
              this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
              this.fields.quocGia = this.quocGia;
              if (this.totalItems <= 0) {
                this.checkLoadList = true;
              }
            },
            error: () => (this.isLoading = false),
          });
  
      } else {
        this.userService
          .query("0", {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
          })
          .subscribe({
            next: (res: HttpResponse<DoanRa[]>) => {
              this.isLoading = false;
              this.ExPrItem = res.body;
              this.filter = Object.assign({}, this.fields);
              this.ExPrItem = this.transform(this.ExPrItem, this.filter);
              this.totalItems = Number(this.ExPrItem.length);
              this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
              if (this.totalItems <= 0) {
                this.checkLoadList = true;
              }
            },
            error: () => (this.isLoading = false),
          });
  
      }
    } else {
      this.checkLoadList = false;
      this.fields.ngayNC = $('#ngayNC').first().val();
      this.fields.ngayXC = $('#ngayXC').first().val();
      Object.keys(this.fields).forEach((key) => {
        if (key !== 'quocGia') {
          this.fields[key] = this.fields[key].trim();
        }
      });
      Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
      this.quocGia = this.fields.quocGia;
      if (this.fields.quocGia != null) {
        this.userService
          .query(this.fields.quocGia, {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
          })
          .subscribe({
            next: (res: HttpResponse<DoanRa[]>) => {
              this.isLoading = false;
              this.onSuccess(res.body, res.headers);
              this.fields.quocGia = '';
              this.ExPrItem = this.users;
              this.filter = Object.assign({}, this.fields);
              this.ExPrItem = this.transform(this.ExPrItem, this.filter);
              this.totalItems = Number(this.ExPrItem.length);
              this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
              this.fields.quocGia = this.quocGia;
              if (this.totalItems <= 0) {
                this.checkLoadList = true;
              }
            },
            error: () => (this.isLoading = false),
          });
  
      } else {
        this.userService
          .query("0", {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
          })
          .subscribe({
            next: (res: HttpResponse<DoanRa[]>) => {
              this.isLoading = false;
              this.ExPrItem = res.body;
              this.filter = Object.assign({}, this.fields);
              this.ExPrItem = this.transform(this.ExPrItem, this.filter);
              this.totalItems = Number(this.ExPrItem.length);
              this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
              if (this.totalItems <= 0) {
                this.checkLoadList = true;
              }
            },
            error: () => (this.isLoading = false),
          });
      }
    }
  }

  search() {
    sessionStorage.removeItem('dktk')
    this.checkLoadList = false;
    this.fields.ngayNC = $('#ngayNC').first().val();
    this.fields.ngayXC = $('#ngayXC').first().val();
    Object.keys(this.fields).forEach((key) => {
      if (key !== 'quocGia') {
        this.fields[key] = this.fields[key].trim();
      }
    });
    Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
    this.quocGia = this.fields.quocGia;
    if (this.fields.quocGia != null) {
      this.userService
        .query(this.fields.quocGia, {
          page: this.page - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<DoanRa[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers);
            this.fields.quocGia = '';
            this.ExPrItem = this.users;
            this.filter = Object.assign({}, this.fields);
            this.ExPrItem = this.transform(this.ExPrItem, this.filter);
            this.totalItems = Number(this.ExPrItem.length);
            this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
            this.fields.quocGia = this.quocGia;
            if (this.totalItems <= 0) {
              this.checkLoadList = true;
            }
          },
          error: () => (this.isLoading = false),
        });

    } else {
      this.userService
        .query("0", {
          page: this.page - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<DoanRa[]>) => {
            this.isLoading = false;
            this.ExPrItem = res.body;
            this.filter = Object.assign({}, this.fields);
            this.ExPrItem = this.transform(this.ExPrItem, this.filter);
            this.totalItems = Number(this.ExPrItem.length);
            this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
            if (this.totalItems <= 0) {
              this.checkLoadList = true;
            }
          },
          error: () => (this.isLoading = false),
        });
    }
  }

  deleteUser(user: DoanRa): void {
    if (this.fullAuth == true) {
      const modalRef = this.modalService.open(DoanRaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.user = user;
      // unsubscribe not needed because closed completes on modal close
      modalRef.closed.subscribe(reason => {
        if (reason === 'deleted') {
          this.alert.success('Xóa thành công')
          this.loadAll();
          this.updateFilters();
        }
      });
    } else if (String(user.createdBy) == String(this.userName)) {
      const modalRef = this.modalService.open(DoanRaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.user = user;
      // unsubscribe not needed because closed completes on modal close
      modalRef.closed.subscribe(reason => {
        if (reason === 'deleted') {
          this.alert.success('Xóa thành công')
          this.loadAll();
          this.updateFilters();
        }
      });
    } else {
      this.alert.warn('Bạn chỉ được xóa dữ liệu do chính mình tạo ra!');
    }
  }

  editUser(item: DoanRa): void {
    if (this.fullAuth == true) {
      this.router.navigate(['/doanRa/quanLyDoanRa/editDR', item.maDoan]);
    } else if (String(item.createdBy) == String(this.userName)) {
      this.router.navigate(['/doanRa/quanLyDoanRa/editDR', item.maDoan]);
    } else {
      this.alert.warn('Bạn chỉ được sửa dữ liệu do chính mình tạo ra!');
    }
  }

  loadAll(): void {
    this.isLoading = true;
    this.userService
      .query("0", {
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<DoanRa[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
        },
        error: () => (this.isLoading = false),
      });


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

  private onSuccess(users: DoanRa[] | null, headers: HttpHeaders): void {
    this.users = users;
    this.ExPrItem = this.users;
    this.totalItems = Number(this.ExPrItem.length);
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateFilters();
  }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
    if (Object.keys(filter).length == 0) return items;
    let filterKeys = Object.keys(filter);
    let dk = JSON.stringify(this.filter);

    return items.filter(item => {
      return filterKeys.every(keyName => {
        // console.log(keyName);
        if (keyName === 'quocGia' && (filter[keyName] === null || filter[keyName] === 'null')) {
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

  loadDataPrint(): void {
    this.fields.ngayNC = $('#ngayNC').first().val();
    this.fields.ngayXC = $('#ngayXC').first().val();
    Object.keys(this.fields).forEach((key) => {
      if (key !== 'quocGia') {
        this.fields[key] = this.fields[key].trim();
      }
    });
    Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
    this.quocGia = this.fields.quocGia;
    if (this.fields.quocGia != null) {
      this.userService
        .query(this.fields.quocGia, {
          page: this.page - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<DoanRa[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers);
            this.fields.quocGia = '';
            this.pitems = this.users;
            this.filter = Object.assign({}, this.fields);
            this.pitems = this.transform(this.pitems, this.filter);
            this.ptotalItems = Number(this.pitems.length);
            this.fields.quocGia = this.quocGia;
            this.print();

          },
          error: () => (this.isLoading = false),
        });

    } else {
      this.userService
        .query("0", {
          page: this.page - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<DoanRa[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers);
            this.pitems = this.users;
            this.filter = Object.assign({}, this.fields);
            this.pitems = this.transform(this.pitems, this.filter);
            this.ptotalItems = Number(this.pitems.length);
            this.print();
          },
          error: () => (this.isLoading = false),
        });

    }
  }

  loadDataExport(): void {
    this.fields.ngayNC = $('#ngayNC').first().val();
    this.fields.ngayXC = $('#ngayXC').first().val();
    try {
      Object.keys(this.fields).forEach(key => this.fields[key] = this.fields[key].trim());
    } catch (error) {
      
    }
    Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
    this.quocGia = this.fields.quocGia;
    if (this.fields.quocGia != null) {
      this.userService
        .query(this.fields.quocGia, {
          page: this.page - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<DoanRa[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers);
            this.fields.quocGia = '';
            this.eitems = this.users;
            this.filter = Object.assign({}, this.fields);
            this.eitems = this.transform(this.eitems, this.filter);
            this.ptotalItems = Number(this.eitems.length);
            this.export();
            this.fields.quocGia = this.quocGia;
          },
          error: () => (this.isLoading = false),
        });

    } else {
      this.userService
        .query("0", {
          page: this.page - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .subscribe({
          next: (res: HttpResponse<DoanRa[]>) => {
            this.isLoading = false;
            this.onSuccess(res.body, res.headers);
            this.eitems = this.users;
            this.filter = Object.assign({}, this.fields);
            this.eitems = this.transform(this.eitems, this.filter);
            this.ptotalItems = Number(this.eitems.length);
            this.export();
          },
          error: () => (this.isLoading = false),
        });

    }
  }

  private onPrintSuccess(pitems: DoanRa[] | null, headers: HttpHeaders): void {
    this.pitems = pitems;
  }

  private onExportSuccess(eitems: DoanRa[] | null, headers: HttpHeaders): void {
    this.eitems = eitems;
  }

  print(): void {
    const cValue = formatDate(new Date, 'yyyy-MM-dd', 'en-US');
    const printWindow = window.open('', 'PRINT');
    let dataString: string = "";
    let condition: string = "";
    if (this.fields.nam == "" || this.fields.nam == undefined || this.fields.nam == null) {
      this.fields.nam = '';
    } else {
      condition += 'Năm: ' + String(this.fields.nam) + ' '
    }
    if (this.fields.ngayXC == "" || this.fields.ngayXC == undefined || this.fields.ngayXC == null) {
      this.fields.ngayXC = '';
    } else {
      condition += 'Từ ngày: ' + $('#ngayXC').first().val() + ' '
    }
    if (this.fields.ngayNC == "" || this.fields.ngayNC == undefined || this.fields.ngayNC == null) {
      this.fields.ngayNC = '';
    } else {
      condition += 'Đến ngày: ' + $('#ngayNC').first().val() + ' '
    }

    if (this.fields.quocGia == '' || this.fields.quocGia == undefined || this.fields.quocGia == null) {
      this.fields.quocGia == ''
    } else {
      for (let i = 0; i < this.quocGiaList.length; i++) {
        if (this.fields.quocGia == this.quocGiaList[i].maQG) {
          var tenQuocgia = this.quocGiaList[i].ten;
          break;
        }
      }
      condition += 'Quốc gia: ' + tenQuocgia;
    }


    var tongSoTV = 0
    for (let i = 0; i < this.ptotalItems; i++) {
      var pQuocGia = '';

      for (let index = 0; index < this.pitems[i].listHoSoDtl.length; index++) {
        if (index == 0) {
          pQuocGia = this.pitems[i].listHoSoDtl[index].quocGia;
        } else {
          pQuocGia = pQuocGia + ', ' + this.pitems[i].listHoSoDtl[index].quocGia;
        }
      }
      tongSoTV += this.pitems[i].soLuongTV;
      dataString = dataString + '<tr>'
        + '<td class="text-center">' + (i + 1)
        + '</td>'
        + '<td class="data-text" style="word-wrap: break-word;min-width: 150px;max-width: 150px;">' + this.pitems[i].tenDoan + '</td>'
        + '<td class="data-text" style="word-wrap: break-word;min-width: 150px;max-width: 150px;">' + (this.pitems[i].truongDoan == null ? "" : this.pitems[i].truongDoan) + '</td>'
        + '<td class="data-text">' + (this.pitems[i].chucVu == null ? "" : this.pitems[i].chucVu) + '</td>'
        + '<td class="data-text">' + pQuocGia + '</td>'
        + '<td class="data-text">' + (this.pitems[i].mucDichHD == null ? "" : this.pitems[i].mucDichHD) + '</td>'
        + '<td class="data-text" style="text-align:center">' + (this.pitems[i].ngayXC == null ? "" : this.pitems[i].ngayXC) + '</td>'
        + '<td class="data-text" style="text-align:center">' + (this.pitems[i].ngayNC == null ? "" : this.pitems[i].ngayNC) + '</td>'
        + '<td class="data-text" style="text-align:center">' + (this.pitems[i].soLuongTV == null ? "" : this.pitems[i].soLuongTV) + '</td>'
      '</tr>';
    }
    printWindow.document.write(`<html><head><style>
      .title{
        height:20px;
        font-family: Tahoma, Verdana, Arial, Helvetica, sans-serif;
        color: #000000;
        font-size: 10pt;
      }
      .title_head{
        height:30px;
        font-family: Tahoma, Verdana, Arial, Helvetica, sans-serif;
        color: #000000;
        font-size: 13pt;
      }
      .data-text{
        font-family: Tahoma, Verdana, Arial, Helvetica, sans-serif;
        color: #000000;
        font-size: 9pt;
        padding:5px;
      }

      @page {
        size: A4 landscape;
        size: 287mm 210mm;
      }
      table {
        border-collapse: collapse;
      }
      .text-center {
        font-family: Tahoma, Verdana, Arial, Helvetica, sans-serif;
        color: #000000;
        font-size: 9pt;
        text-align:center;
      }
    </style>
    </head>
    <body><div style="background-color: white;" id="print" style="width:1123px">
        <div style="width:1123px">
          <table style="background-color: white;width:1123px"  class="table-space" border="0">
            <tr>
              <td  style="text-align: center;width: 23%;">
                <div class="title"><b>BAN ĐỐI NGOẠI TRUNG ƯƠNG ĐẢNG</b></div>
                <div class="title"><b>VỤ LỄ TÂN</b></div>
              </td>
              <td style="text-align: center;width: 77%;">
                <div class="title"></div>
              </td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center;">
                  <div class="title_head"><b>BÁO CÁO DANH SÁCH ĐOÀN RA</b></div>
                </td>
            </tr>  
            <tr >
                <td colspan="2" style="text-align: center;">
                  <div class="title">${condition}</div>
                </td>
            </tr>        
          </table>
          </div>
          <br>
    <div class="table-responsive" style="width:1123px">
      <table class="table table-striped" aria-describedby="user-management-page-heading" style="width:1123px" border="1">
        <thead>
          <tr >
            <th scope="col" class="text-center" style="width:5%"><span>STT</span></th>
            <th scope="col" class="text-center" style="width:10%"><span>Tên đoàn</span> </th>
            <th scope="col" class="text-center" style="width:10%"><span>Trưởng đoàn</span> </th>
            <th scope="col" class="text-center" style="width:10%"><span>Chức vụ - cơ quan công tác</span> </th>
            <th scope="col" class="text-center" style="width:10%"><span>Quốc gia đến</span></th>
            <th scope="col" class="text-center" style="width:10%">
              <span>Mục đích hoạt động</span>
            </th>
            <th scope="col" class="text-center" style="width:15%">
                <span>Ngày xuất cảnh</span> 
            </th>
            <th scope="col" class="text-center" style="width:10%">
              <span>Ngày nhập cảnh</span> 
            </th>
            <th scope="col" class="text-center" style="width:12%">
            <span>Số lượng thành viên</span> 
        </th>
          </tr>
        </thead>
        <tbody>
        ${dataString}
        </tbody>
      </table>
    </div>
    <br>
    <div class="title">
        <b><i>Tổng số đoàn ra: ${this.ptotalItems}</i></b>
    </div>
    <div class="title">
        <b><i>Tổng số thành viên: ${tongSoTV}</i></b>
    </div>
    <div class="title">
            <table style="background-color: white;width:1123px"  class="table-space" border="0">
              <tr>
                <td  style="text-align: center;width: 77%;">
                  <div class="title"></div>
                </td>
                <td style="text-align: center;width: 23%;">
                  <div class="text-center"> <i>Ngày ${cValue.split('-')[2]} tháng ${cValue.split('-')[1]} năm ${cValue.split('-')[0]}</i></div>
                </td>
              </tr>
              <tr>
              <td  style="text-align: center;width: 77%;">
                <div class="title"></div>
                </td>
                <td style="text-align: center;width: 23%;">
                  <div class="text-center"><b>Người lập</b></div>
                </td>
              </tr>  
              <tr >
                  <td  style="text-align: center;width: 77%;">
                    <div class="title"></div>
                  </td>
                    <td style="text-align: center;width: 23%;">
                  <div class="text-center"><i>(Ký, họ tên)</i></div>
            </td>
              </tr>        
            </table>
    </div>
  </div>
    </body></html>`)
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }


  export() {
    let totalEX = this.eitems.length;
    let tsTV = 0;
    var options = {
      useStyles: true,
      useSharedStrings: true
    };
    let workbook = new Excel.Workbook(options);
    var worksheet = workbook.addWorksheet('My Sheet', { properties: { tabColor: { argb: 'FFC0000' } } });
    worksheet.columns = [
      { header: 'STT', key: 'soTt', width: 5 },
      { header: 'Tên đoàn', key: 'tenDoan', width: 25 },
      { header: 'Trưởng đoàn', key: 'truongDoan', width: 15 }, //style: { font: { name: 'Arial Black', color: { argb: 'FF0000' } } }
      { header: 'Chức vụ - cơ quan công tác', key: 'chucVu', width: 15 },
      { header: 'Quốc gia đến', key: 'quocGia', width: 15 },
      { header: 'Mục đích hoạt động', key: 'mDHD', width: 15 },
      { header: 'Ngày xuất cảnh', key: 'ngayXC', width: 13 }, //style: { numFmt: 'dd/mm/yyyy' }
      { header: 'Ngày nhập cảnh', key: 'ngayNC', width: 13 },
      { header: 'Số lượng thành viên', key: 'sluongTV', width: 15 },
    ];

    for (let i = 0; i < this.eitems.length; i++) {
      let tenQuocGiaEx = '';
      for (let j = 0; j < this.eitems[i].listHoSoDtl.length; j++) {
        if (j == 0) {
          tenQuocGiaEx = this.eitems[i].listHoSoDtl[j].quocGia
        } else {
          tenQuocGiaEx = tenQuocGiaEx + ',' + this.eitems[i].listHoSoDtl[j].quocGia;
        }
      }
      worksheet.addRow({
        soTt: i + 1,
        tenDoan: this.eitems[i].tenDoan,
        truongDoan: this.eitems[i].truongDoan,
        chucVu: this.eitems[i].chucVu,
        quocGia: tenQuocGiaEx,
        mDHD: this.eitems[i].mucDichHD == 'null' ? "" : this.eitems[i].mucDichHD,
        ngayXC: this.eitems[i].ngayXC,
        ngayNC: this.eitems[i].ngayNC,
        sluongTV: this.eitems[i].soLuongTV,
      });
      tsTV += this.eitems[i].soLuongTV;
    }



    // cell.alignment = {
    //   vertical: 'middle', horizontal: 'center'
    // };
    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
      row.eachCell(function (cell) {
        cell.font = {
          name: 'Times New Roman',
          family: 2,
          bold: false,
          size: 10,
        };
        cell.alignment = {
          vertical: 'middle', horizontal: 'center', wrapText: true
        };
        for (let i = 1; i <= totalEX + 1; i++) {
          worksheet.getCell('B' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('B' + [i]).alignment = {
            vertical: 'middle', horizontal: 'left', wrapText: true
          };
          worksheet.getCell('C' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('C' + [i]).alignment = {
            vertical: 'middle', horizontal: 'left', wrapText: true
          };
          worksheet.getCell('D' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('D' + [i]).alignment = {
            vertical: 'middle', horizontal: 'left', wrapText: true
          };
          worksheet.getCell('E' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('E' + [i]).alignment = {
            vertical: 'middle', horizontal: 'left', wrapText: true
          };
          worksheet.getCell('F' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('F' + [i]).alignment = {
            vertical: 'middle', horizontal: 'left', wrapText: true
          };
          worksheet.getCell('H' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('H' + [i]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };

          worksheet.getCell('G' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('G' + [i]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
        }

        for (var i = 1; i < 10; i++) {
          if (rowNumber == 1) {
            row.getCell(i).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'C7C7C7' }
            };
          }
          row.getCell(i).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          row.getCell(12).align = {
            alignment: { vertical: 'middle', horizontal: 'right', wrapText: true },

          };
          const footerRowIndex = totalEX + 4;
          const footerCell = worksheet.getRow(footerRowIndex).getCell(2);
          footerCell.value = 'Tổng số đoàn ra: ' + totalEX;
          footerCell.font = { color: { argb: 'black' }, italic: true, bold: true, name: 'Times New Roman', size: 10, };
          footerCell.alignment = { horizontal: 'left' };
          const footerCell1 = worksheet.getRow(footerRowIndex + 1).getCell(2);
          footerCell1.value = 'Tổng số thành viên: ' + tsTV;
          footerCell1.font = { color: { argb: 'black' }, italic: true, bold: true, name: 'Times New Roman', size: 10, };
          footerCell1.alignment = { horizontal: 'left' };
        }


      });
    });

    let fileName = "BC_DSDoanRa" + '_' + new Date().getTime() + ".xlsx";
    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer()
      .then(function (buffer) {
        // done buffering
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(data, fileName);
      });
  }

  changeXC() {
    this.formatDateXC = false;

  }

  changeNC() {
    this.formatDateNC = false;
  }

  downloadFileAll(maDoan: number, name: string) {
    this.userService.downloadFileAll(maDoan).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      FileSaver.saveAs(blob, maDoan + "_" + name);
    }), (error: any) => console.log('Error downloading the file');
  }

  resetFields() {
    this.fields.maDoan = '';
    this.fields.tenDoan = '';
    this.fields.chucVu = '';
    this.fields.mucDichHD = '';
    this.fields.quocGia = null;
    this.fields.ngayNC = '';
    this.fields.ngayXC = '';
    this.fields.truongDoan = '';
    this.fields.nam = '';
  }

  checkDateNgayNC($event) {
    this.ngayNCModel = $event;
    if (this.ngayNCModel != null && this.ngayXCModel != null) {
      if (this.ngayNCModel < this.ngayXCModel) {
        $('#ngayNC').val(null)
        this.alert.warn("Vui lòng nhập Ngày nhập cảnh lớn hơn Ngày xuất cảnh")
        $('#ngayNC').focus()
      }
    }
  }

  checkDateNgayXC($event) {
    this.ngayXCModel = $event;
    if (this.ngayNCModel != null && this.ngayXCModel != null) {
      if (this.ngayNCModel < this.ngayXCModel) {
        $('#ngayXC').val(null)
        this.alert.warn("Vui lòng nhập Ngày xuất cảnh nhỏ hơn Ngày nhập cảnh")
        $('#ngayXC').focus()
      }
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

  fieldsTV = {
    maHSDoan: '',
    maQG: ''
  };
  filterTV = {};
  PopUp(event: Event, element: HTMLDivElement, maDoan: number, maQGD: string) {
    this.maDoanSearchTV = maDoan;
    this.isLoading = true;
    this.qltvService
      .query()
      .subscribe({
        next: (res: HttpResponse<QuanLyTV[]>) => {
          this.qlyTV = res.body;
          this.isLoading = false;
          this.fieldsTV.maHSDoan = this.maDoanSearchTV.toString();
          this.fieldsTV.maQG = maQGD;
          this.filterTV = Object.assign({}, this.fieldsTV);
          this.qlyTV = this.transform(this.qlyTV, this.filterTV);
          this.totalItemsTV = Number(this.qlyTV.length);
          element.classList.toggle('is-visible');
        },
        error: () => (this.isLoading = false),
      });

  }

  PopUpClose(event: Event, element: HTMLDivElement) {
    element.classList.toggle('is-visible');
  }

  onSelectDoan(chiTietDoan: any) {
    sessionStorage.removeItem('dktk');
    this.router.navigateByUrl('/doanRa/quanLyTVRa/new', { state: chiTietDoan });
  }

  value: any;
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
