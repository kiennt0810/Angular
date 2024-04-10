import { Component, Injectable, OnInit } from '@angular/core';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT } from 'app/config/navigation.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { QuanLyTVService } from '../service/quanLyTV.service';
import { QuanLyTV } from '../quanLyTV.model';
import { quanLyTVDeleteDialogComponent } from '../delete/quanLyTV-delete-dialog.component';
import moment from 'moment';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from 'file-saver';
import { formatDate } from '@angular/common';
import { DelegationIn } from 'app/quanLyDoan/quanLyDoanVao/doanVao.model';
import { CategoriesManagementService } from 'app/quanLyDoan/quanLyDoanVao/service/categories-management.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { SessionStorageService } from 'ngx-webstorage';


type objField = {};
declare var $: any;
@Component({
  selector: 'jhi-user-mgmt',
  templateUrl: './quanLyTV.component.html',
  styleUrls: ['./quanLyTV.component.scss'],
  
})

export class quanLyTVComponent implements OnInit {
  currentAccount: Account | null = null;
  users: QuanLyTV[] | null = null;
  isLoading = false;
  totalItems = 0;
  pageDoan = 0;
  itemsPerPage = 5;
  page!: number;
  pageSize!: number;
  predicate!: string;
  ascending!: boolean;
  formatDateNC: boolean;
  formatDateXC: boolean;
  ptotalItems = 0;
  pitems: QuanLyTV[] | null = null;
  eitems: QuanLyTV[] | null = null;
  qlyDoan: DelegationIn[] | null = null;
  doanAll: DelegationIn[] | null = null;
  ExPrItem: QuanLyTV[] | null = null;
  chiTietDoan: DelegationIn | null = null;
  citems: User[] | null = null;
  totalPage = 0;
  gioiTinh: any;
  roles: string;
  checkAuth = false;
  fullAuth = false;
  errorDate = false;
  userName: string = this.sessionStorageService.retrieve('userName');
  fields = {
    soTT: '',
    maTV: '',
    maHSDoan: '',
    chucVu: '',
    hoTen: '',
    tenHSDoan: '',
    ngayXC: '',
    soHoChieu: '',
    coQuan: '',
    ngayNC: '',
    maQG: null,
  };
  filter = {};
  currentPath: string;

  constructor(
    private qltvService: QuanLyTVService,
    private doanVaoService: CategoriesManagementService,
    private alert: AlertServiceCheck,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private qGService: QuocgiavavunglanhthoService,
    private NavbarService: NavBarService,
    private sessionStorageService: SessionStorageService,
  ) { }

  ngOnInit(): void {
    // this.accountService.identity().subscribe(account => (this.currentAccount = account));
    this.activatedRoute.queryParams.subscribe(params => {
      this.page = params['page'];
      this.handleNavigation();
    })
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
    this.citems = qG;
  }

  setActive(user: QuanLyTV, isActivated: boolean): void {
    this.loadAll();
  }

  trackIdentity(_index: number, item: QuanLyTV): number {
    return;
  }

  deleteCondition(): void {

  }

  removevalue() {

  }

  updateFilters() {
    const dk = sessionStorage.getItem('dktk')
    if (dk && dk !== "{}") {
      this.ExPrItem = this.users;
      this.filter = JSON.parse(dk);
      this.fields = JSON.parse(dk);
      this.ExPrItem = this.transform(this.ExPrItem, this.filter);
      this.totalItems = Number(this.ExPrItem.length);
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    } else {
      if ((this.fields.ngayNC != undefined && this.fields.ngayXC != undefined)
      && (this.fields.ngayNC != '' && this.fields.ngayXC != '')
      && (this.fields.ngayNC > this.fields.ngayXC)) {
      this.alert.warn('Ngày xuất cảnh phải lớn hơn ngày nhập cảnh');
      this.errorDate = true;
      $('#ngayNC').focus();
    } else {
      this.errorDate = false;
      this.fields.ngayNC = $('#ngayNC').first().val();
      this.fields.ngayXC = $('#ngayXC').first().val();
      Object.keys(this.fields).forEach((key) => {
        if (key !== 'maQG') {
          this.fields[key] = this.fields[key].trim();
        }
      }); Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
      this.ExPrItem = this.users;
      this.filter = Object.assign({}, this.fields);
      this.ExPrItem = this.transform(this.ExPrItem, this.filter);
      this.totalItems = Number(this.ExPrItem.length);
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    }
    }
  }

  search() {
    sessionStorage.removeItem('dktk')
    if ((this.fields.ngayNC != undefined && this.fields.ngayXC != undefined)
      && (this.fields.ngayNC != '' && this.fields.ngayXC != '')
      && (this.fields.ngayNC > this.fields.ngayXC)) {
      this.alert.warn('Ngày xuất cảnh phải lớn hơn ngày nhập cảnh');
      this.errorDate = true;
      $('#ngayNC').focus();
    } else {
      this.errorDate = false;
      this.fields.ngayNC = $('#ngayNC').first().val();
      this.fields.ngayXC = $('#ngayXC').first().val();
      Object.keys(this.fields).forEach((key) => {
        if (key !== 'maQG') {
          this.fields[key] = this.fields[key].trim();
        }
      }); Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
      this.ExPrItem = this.users;
      this.filter = Object.assign({}, this.fields);
      this.ExPrItem = this.transform(this.ExPrItem, this.filter);
      this.totalItems = Number(this.ExPrItem.length);
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    }
  }

  deleteUser(user: QuanLyTV): void {
    if (this.fullAuth == true) {
      const modalRef = this.modalService.open(quanLyTVDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.user = user;
      // unsubscribe not needed because closed completes on modal close
      modalRef.closed.subscribe(reason => {
        if (reason === 'deleted') {
          this.alert.success('Xóa thành công')
          this.loadAll();
        }
      });
    } else if (String(user.createdBy) == String(this.userName)) {
      const modalRef = this.modalService.open(quanLyTVDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.user = user;
      // unsubscribe not needed because closed completes on modal close
      modalRef.closed.subscribe(reason => {
        if (reason === 'deleted') {
          this.alert.success('Xóa thành công')
          this.loadAll();
        }
      });;
    } else {
      this.alert.warn('Bạn chỉ được xóa dữ liệu do chính mình tạo ra!');
    }
  }

  editUser(item: QuanLyTV): void {
    if (this.fullAuth == true) {
      this.router.navigate(['/doanVao/quanLyTV/edit', item.maTV]);
    } else if (String(item.createdBy) == String(this.userName)) {
      this.router.navigate(['/doanVao/quanLyTV/edit', item.maTV]);
    } else {
      this.alert.warn('Bạn chỉ được sửa dữ liệu do chính mình tạo ra!');
    }
  }

  loadAll(): void {
    this.isLoading = true;
    this.qltvService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<QuanLyTV[]>) => {
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

  private onSuccess(users: QuanLyTV[] | null, headers: HttpHeaders): void {
    this.users = users;
    this.ExPrItem = this.users;
    this.totalItems = Number(this.ExPrItem.length);
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateFilters();
  }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  resetFields() {
    this.fields.soTT = '';
    this.fields.maTV = '';
    this.fields.maHSDoan = '';
    this.fields.chucVu = '';
    this.fields.hoTen = '';
    this.fields.tenHSDoan = '';
    this.fields.ngayXC = '';
    this.fields.soHoChieu = '';
    this.fields.coQuan = '';
    this.fields.ngayNC = '';
    this.fields.maQG = '';
  }

  transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
    if (Object.keys(filter).length == 0) return items;
    let filterKeys = Object.keys(filter);
    let dk = JSON.stringify(this.filter);
    return items.filter(item => {
      return filterKeys.every(keyName => {
        // console.log(keyName);
        if (keyName === 'maQG' && (filter[keyName] === null || filter[keyName] === 'null')) {
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
    this.isLoading = true;
    this.qltvService
      .query()
      .subscribe({
        next: (res: HttpResponse<QuanLyTV[]>) => {
          this.isLoading = false;
          this.onPrintSuccess(res.body, res.headers);
          this.updateFilters();
          this.pitems = this.transform(this.pitems, this.filter);
          this.ptotalItems = Number(this.pitems.length);
          this.print();
        },
        error: () => (this.isLoading = false),
      });


  }

  loadDataExport(): void {
    this.isLoading = true;
    this.qltvService
      .query()
      .subscribe({
        next: (res: HttpResponse<QuanLyTV[]>) => {
          this.isLoading = false;
          this.onExportSuccess(res.body, res.headers);
          this.updateFilters();
          this.eitems = this.transform(this.eitems, this.filter);
          this.export();
        },
        error: () => (this.isLoading = false),
      });
  }

  private onPrintSuccess(pitems: QuanLyTV[] | null, headers: HttpHeaders): void {
    this.pitems = pitems;
  }

  private onExportSuccess(eitems: QuanLyTV[] | null, headers: HttpHeaders): void {
    this.eitems = eitems;
  }

  print(): void {
    const cValue = formatDate(new Date, 'yyyy-MM-dd', 'en-US');
    const printWindow = window.open('', 'PRINT');
    let dataString: string = "";
    for (let i = 0; i < this.ptotalItems; i++) {
      dataString = dataString + '<tr>'
        + '<td class="text-center">' + (i + 1)
        + '</td>'
        + '<td class="data-text" style="text-align:center">' + this.pitems[i].soTT + '</td>'
        + '<td class="data-text">' + this.pitems[i].hoTen + '</td>'
        + '<td class="data-text">' + (this.pitems[i].chucVu == null ? "" : this.pitems[i].chucVu) + '</td>'
        + '<td class="data-text">' + this.pitems[i].coQuan + '</td>'
        + '<td class="data-text" style="text-align:center">' + (this.pitems[i].ngaySinh == null ? "" : this.pitems[i].ngaySinh) + '</td>'
        + '<td class="data-text" style="text-align:center">' + (this.pitems[i].gioiTinh ? "Nam" : "Nữ") + '</td>'
        + '<td class="data-text" style="text-align:left">' + (this.pitems[i].soHoChieu == null ? "" : this.pitems[i].soHoChieu) + '</td>'
        + '<td class="data-text" style="text-align:center">' + (this.pitems[i].hC_NgayCap == null ? "" : this.pitems[i].hC_NgayCap) + '</td>'
        + '<td class="data-text">' + (this.pitems[i].tenHSDoan == null ? "" : this.pitems[i].tenHSDoan) + '</td>'
        + '<td class="data-text" style="text-align:center">' + (this.pitems[i].ngayNC == null ? "" : this.pitems[i].ngayNC) + '</td>'
        + '<td class="data-text" style="text-align:center">' + (this.pitems[i].ngayXC == null ? "" : this.pitems[i].ngayXC) + '</td>'
        + '<td class="data-text">' + (this.pitems[i].noiLuuTru == null ? "" : this.pitems[i].noiLuuTru) + '</td>'
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
                  <div class="title_head"><b>BÁO CÁO DANH SÁCH THÀNH VIÊN ĐOÀN VÀO</b></div>
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
            <th scope="col" class="text-center" style="width:8%"><span>STT trong đoàn</span> </th>
            <th scope="col" class="text-center" style="width:12%"><span>Họ và tên</span> </th>
            <th scope="col" class="text-center" style="width:10%"><span>Chức vụ</span></th>
            <th scope="col" class="text-center" style="width:10%">
              <span>Cơ quan làm việc</span> 
            </th>
            <th scope="col" class="text-center" style="width:6%">
              <span>Ngày sinh</span>
            </th>
            <th scope="col" class="text-center" style="width:5%">
              <span>Giới tính</span> 
            </th>
            <th scope="col" class="text-center" style="width:8%">
                <span>Số hộ chiếu</span> 
            </th>
            <th scope="col" class="text-center" style="width:6%">
            <span>Ngày cấp</span> 
        </th>
        <th scope="col" class="text-center" style="width:12%">
            <span>Là thành viên của đoàn</span> 
        </th>
        <th scope="col" class="text-center" style="width:6%">
        <span>Ngày nhập cảnh</span> 
        </th>
        <th scope="col" class="text-center" style="width:6%">
            <span>Ngày xuất cảnh</span> 
        </th>
        <th scope="col" class="text-center" style="width:6%">
            <span>Nơi lưu trú</span> 
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
        <b><i>Tổng số thành viên: </i></b><b><i>${this.ptotalItems}</i></b>
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
      { header: 'STT trong đoàn', key: 'soTT', width: 5 },
      // { header: 'Chức vụ', key: 'chucVu', width: 20 },
      { header: 'Họ và tên', key: 'hoTen', width: 12 }, //style: { font: { name: 'Arial Black', color: { argb: 'FF0000' } } }
      { header: 'Chức vụ', key: 'chucVu', width: 12 },
      { header: 'Cơ quan làm việc', key: 'coQuan', width: 12 },
      { header: 'Ngày sinh', key: 'ngaySinh', width: 10 },
      { header: 'Giới tính', key: 'gioiTinh', width: 8 }, //style: { numFmt: 'dd/mm/yyyy' }
      { header: 'Số hộ chiếu', key: 'hoChieu', width: 10 },
      { header: 'Ngày cấp', key: 'hc_NgayCap', width: 10 },
      { header: 'Là thành viên của đoàn', key: 'tenHSDoan', width: 10 },
      { header: 'Ngày nhập cảnh', key: 'ngayNC', width: 10 },
      { header: 'Ngày xuất cảnh', key: 'ngayXC', width: 10 },
      { header: 'Nơi lưu trú', key: 'noiLuuTru', width: 15 },
    ];

    for (let i = 0; i < this.eitems.length; i++) {
      let tenQuocGiaEx = '';
      if (this.eitems[i].gioiTinh)
        this.gioiTinh = ""
      else if (this.eitems[i].gioiTinh == true)
        this.gioiTinh = "Nam"
      else if (this.eitems[i].gioiTinh == false)
        this.gioiTinh = "Nữ"

      worksheet.addRow({
        soTt: i + 1,
        soTT: this.eitems[i].soTT,
        hoTen: this.eitems[i].hoTen,
        chucVu: this.eitems[i].chucVu,
        coQuan: this.eitems[i].coQuan,
        ngaySinh: this.eitems[i].ngaySinh,
        gioiTinh: this.gioiTinh,
        hoChieu: this.eitems[i].soHoChieu,
        hc_NgayCap: this.eitems[i].hC_NgayCap,
        tenHSDoan: this.eitems[i].tenHSDoan,
        ngayNC: this.eitems[i].ngayNC,
        ngayXC: this.eitems[i].ngayXC,
        noiLuuTru: this.eitems[i].noiLuuTru
      });
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
          worksheet.getCell('J' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('J' + [i]).alignment = {
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
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('H' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('H' + [i]).alignment = {
            vertical: 'middle', horizontal: 'left', wrapText: true
          };

          worksheet.getCell('G' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('G' + [i]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('M' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('M' + [i]).alignment = {
            vertical: 'middle', horizontal: 'left', wrapText: true
          };
        }

        for (var i = 1; i < 14; i++) {
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
          footerCell.value = 'Tổng số thành viên đoàn vào: ' + totalEX;
          footerCell.font = { color: { argb: 'black' }, italic: true, bold: true ,name: 'Times New Roman', size: 10};
          footerCell.alignment = { horizontal: 'left' };
        }


      });
    });
    let fileName = "BC_DSTVDoanVao" + '_' + new Date().getTime() + ".xlsx";
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
  downloadFileAll(maDoan: string, name: string) {
    this.qltvService.downloadFileAll(maDoan).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      FileSaver.saveAs(blob, maDoan + "_" + name);
    }), (error: any) => console.log('Error downloading the file');
  }

  fieldsDoan = {
    nam: '',
  };
  filterDoan = {};
  PopUp(event: Event, element: HTMLDivElement) {
    this.fieldsDoan.nam = '';
    this.doanVaoService
      .query()
      .subscribe({
        next: (res: HttpResponse<QuanLyTV[]>) => {
          this.qlyDoan = res.body;
          this.doanAll = this.qlyDoan;
          this.isLoading = false;
          element.classList.toggle('is-visible');
        },
        error: () => (this.isLoading = false),
      });
  }

  PopUpClose(event: Event, element: HTMLDivElement) {
    element.classList.toggle('is-visible');
  }

  filterNam() {
    this.filterDoan = Object.assign({}, this.fieldsDoan);
    this.doanAll = this.qlyDoan;
    this.doanAll = this.transform(this.doanAll, this.filterDoan);
  }

  handleChange($event) {
    let index = $event.target.selectedIndex - 1;
    this.chiTietDoan = this.doanAll[index];
    console.log(this.chiTietDoan.maDoan)
    sessionStorage.setItem('currentMaDoan',this.chiTietDoan.maDoan)
  }

  onSelectDoan() {
    if (this.chiTietDoan == null) {
      this.alert.warn('Vui lòng chọn đoàn!')
    } else {
      this.qltvService.getMaDoan(this.chiTietDoan.maDoan)
      this.router.navigateByUrl(`/doanVao/quanLyTV/new/${this.chiTietDoan.maDoan}`);
      //sessionStorage.setItem('currentMadoan', this.chiTietDoan.maDoan)
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
