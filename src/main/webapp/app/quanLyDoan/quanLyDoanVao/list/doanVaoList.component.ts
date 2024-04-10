import { Component, Injectable, OnInit } from '@angular/core';
import { HttpResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT } from 'app/config/navigation.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { CategoriesManagementService } from '../service/categories-management.service';
import { DelegationIn } from '../doanVao.model';
import { CategoriesManagementDeleteDialogComponent } from '../delete/categories-management-delete-dialog.component';
import { DatePipe, formatDate } from '@angular/common';
import * as Excel from "exceljs/dist/exceljs.min.js";
import * as FileSaver from 'file-saver';
import { ListTVComponent } from '../list-tv/list-tv.component';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { AlertService } from 'app/core/util/alert.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { QuanLyTVService } from 'app/quanLyDoan/quanLyTV/service/quanLyTV.service';
import { QuanLyTV } from 'app/quanLyDoan/quanLyTV/quanLyTV.model';
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
  templateUrl: './doanVaoList.component.html',
  styleUrls: ['../../../income.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],

})

export class CategoriesManagementComponent implements OnInit {
  currentAccount: Account | null = null;
  users: DelegationIn[] | null = null;
  pitems: DelegationIn[] | null = null;
  eitems: DelegationIn[] | null = null;
  ExPrItem: DelegationIn[] | null = null;
  isLoading = false;
  totalItems = 0;
  totalItemsTV = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  pageTV!: number;
  pageSize!: number;
  predicate!: string;
  ascending!: boolean;
  ptotalItems = 0;
  totalPage = 0;
  quocGiaList: User[] | null = null;
  qlyTV: QuanLyTV[] | null = null;
  maDoanSearchTV: string;
  showWarning = false;
  tenQG: any;
  roles: string;
  checkAuth = false;
  fullAuth = false;
  userName: string = this.sessionStorageService.retrieve('userName');
  fields = {
    maDoan: '',
    tenDoan: '',
    mucDichHD: '',
    maQG: null,
    quocGia: '',
    ngayNC: '',
    ngayXC: '',
    truongDoan: '',
    nam: ''
  };
  filter = {};
  currentPath: string;

  resetFields() {
    this.fields.maDoan = '';
    this.fields.tenDoan = '';
    this.fields.mucDichHD = '';
    this.fields.maQG = null;
    this.fields.quocGia = '';
    this.fields.ngayNC = '';
    this.fields.ngayXC = '';
    this.fields.truongDoan = '';
    this.fields.nam = '';
  }

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

  constructor(
    private userService: CategoriesManagementService,
    private qGService: QuocgiavavunglanhthoService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private alert: AlertServiceCheck,
    private qltvService: QuanLyTVService,
    private NavbarService: NavBarService,
    private sessionStorageService: SessionStorageService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // this.accountService.identity().subscribe(account => (this.currentAccount = account));
    console.log(this.filter);
    this.activatedRoute.queryParams.subscribe(params => {
      this.page = params['page'];
      // console.log(this.page);
      this.handleNavigation();
      // this.testAPI();
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
    this.quocGiaList = qG;
  }

  // setActive(user: DelegationIn, isActivated: boolean): void {
  //   this.userService.update({ ...user }).subscribe(() => this.loadAll());
  // }

  // trackIdentity(_index: number, item: DelegationIn): number {
  //   return item.stt!;
  // }
  testAPI() {
    this.dktk.page = 1;
    this.userService.getByPage(this.dktk).subscribe({
      next: (res: HttpResponse<User[]>) => {
        this.onSuccess(res.body, res.headers);
        console.log(res.headers.get('Content-Type'))
      }
    })
  }
  deleteCondition(): void {

  }

  removevalue() {

  }

  isInvalidDateNgayNC(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.showWarning = true
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày nhập cảnh theo định dạng DD/MM/YYYY")
      $('#ngayNC').focus
    } else {
      this.showWarning = false
    }
  }

  isInvalidDateNgayXC(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.showWarning = true
      event.target.value = null
      this.alert.warn("Vui lòng nhập ngày xuất cảnh theo định dạng DD/MM/YYYY")
      $('#ngayXC').focus
    } else {
      this.handleChangeNgayXC();
    }
  }

  handleChangeNgayXC() {
    if ((this.fields.ngayNC != undefined && this.fields.ngayXC != undefined) && (this.fields.ngayNC != '' && this.fields.ngayXC != '')) {
      if (this.fields.ngayNC > this.fields.ngayXC) {
        this.alert.warn('Ngày xuất cảnh phải lớn hơn ngày nhập cảnh');
        $('#ngayXC').focus();
      }
    }
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
      this.fields.ngayNC = $('#ngayNC').first().val();
      this.fields.ngayXC = $('#ngayXC').first().val();
      Object.keys(this.fields).forEach((key) => {
        if (key !== 'maQG') {
          this.fields[key] = this.fields[key].trim();
        }
      });
      Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
      this.ExPrItem = this.users;
      this.filter = Object.assign({}, this.fields);
      this.ExPrItem = this.transform(this.ExPrItem, this.filter);
      this.totalItems = Number(this.ExPrItem.length);
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    }
  }

  search() {
    sessionStorage.removeItem('dktk')
    this.fields.ngayNC = $('#ngayNC').first().val();
    this.fields.ngayXC = $('#ngayXC').first().val();
    Object.keys(this.fields).forEach((key) => {
      if (key !== 'maQG') {
        this.fields[key] = this.fields[key].trim();
      }
    });
    Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
    this.ExPrItem = this.users;
    this.filter = Object.assign({}, this.fields);
    this.ExPrItem = this.transform(this.ExPrItem, this.filter);
    this.totalItems = Number(this.ExPrItem.length);
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    // this.users = this.transform(this.users,this.filter);
    // this.totalItems = Number(this.users.length);
  }

  transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
    if (Object.keys(filter).length == 0) return items;
    console.log(filter);

    let filterKeys = Object.keys(filter);
    let dk = JSON.stringify(this.filter);
   
    return items.filter(item => {
      return filterKeys.every(keyName => {
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
        // console.log(keyName);
        
      });
    });
  }

  deleteUser(user: DelegationIn): void {
    if (this.fullAuth == true) {
      const modalRef = this.modalService.open(CategoriesManagementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.user = user;
      // unsubscribe not needed because closed completes on modal close
      modalRef.closed.subscribe(reason => {
        if (reason === 'deleted') {
          this.alert.success('Xoá thành công!')
          this.loadAll();
        }
      });
    } else if (String(user.createdBy) == String(this.userName)) {
      const modalRef = this.modalService.open(CategoriesManagementDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.user = user;
      // unsubscribe not needed because closed completes on modal close
      modalRef.closed.subscribe(reason => {
        if (reason === 'deleted') {
          this.alert.success('Xoá thành công!')
          this.loadAll();
        }
      });
    } else {
      this.alert.warn('Bạn chỉ được xóa dữ liệu do chính mình tạo ra!');
    }
  }

  editUser(item: DelegationIn): void {
    if (this.fullAuth == true) {
      this.router.navigate(['/doanVao/quanLyDoanVao/edit', item.maDoan]);
    } else if (String(item.createdBy) == String(this.userName)) {
      this.router.navigate(['/doanVao/quanLyDoanVao/edit', item.maDoan]);
    } else {
      this.alert.warn('Bạn chỉ được sửa dữ liệu do chính mình tạo ra!');
    }
  }

  loadAll(): void {
    this.isLoading = true;
    this.userService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<DelegationIn[]>) => {
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
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      this.page = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      this.predicate = sort[0];
      this.ascending = sort[1] === ASC;
      this.loadAll();
    })
  }

  private sort(): string[] {
    const result = [`${this.predicate},${this.ascending ? ASC : DESC}`];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  // private onSuccess(users: DelegationIn[] | null, headers: HttpHeaders): void {

  //   this.users = users;
  //   this.ExPrItem = this.users;
  //   this.totalItems = Number(this.ExPrItem.length);
  //   this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
  //   this.updateFilters();
  // }

  private onSuccess(users: DelegationIn[] | null, headers: HttpHeaders): void {

    this.users = users;
    this.ExPrItem = this.users;
    this.totalItems = Number(this.ExPrItem.length);
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateFilters();
  }
  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  loadDataPrint(): void {
    this.isLoading = true;
    this.userService
      .query()
      .subscribe({
        next: (res: HttpResponse<DelegationIn[]>) => {
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
    this.userService
      .query()
      .subscribe({
        next: (res: HttpResponse<DelegationIn[]>) => {
          this.isLoading = false;
          this.onExportSuccess(res.body, res.headers);
          this.updateFilters();
          this.eitems = this.transform(this.eitems, this.filter);
          this.export();
        },
        error: () => (this.isLoading = false),
      });
  }

  private onPrintSuccess(pitems: DelegationIn[] | null, headers: HttpHeaders): void {
    this.pitems = pitems;
  }

  private onExportSuccess(eitems: DelegationIn[] | null, headers: HttpHeaders): void {
    this.eitems = eitems;
  }

  handleChange($event) {
    let index = $event.target.selectedIndex - 1;
    console.log(this.quocGiaList[index]);
    this.tenQG = this.quocGiaList[index].ten;
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
    if (this.fields.ngayNC == "" || this.fields.ngayNC == undefined || this.fields.ngayNC == null) {
      this.fields.ngayNC = '';
    } else {
      condition += 'Từ ngày: ' + $('#ngayNC').first().val() + ' '
    }
    if (this.fields.ngayXC == "" || this.fields.ngayXC == undefined || this.fields.ngayXC == null) {
      this.fields.ngayXC = '';
    } else {
      condition += 'Đến ngày: ' + $('#ngayXC').first().val() + ' '
    }
    if (this.fields.maQG == "" || this.fields.maQG == undefined || this.fields.maQG == null) {
      this.fields.maQG = '';
    } else {
      condition += 'Quốc gia: ' + String(this.tenQG) + ' '
    }
    var tongSoTV = 0
    for (let i = 0; i < this.ptotalItems; i++) {
      tongSoTV += this.pitems[i].soLuongTV;
      dataString = dataString + '<tr>'
        + '<td class="text-center">' + (i + 1)
        + '</td>'
        + '<td class="data-text">' + this.pitems[i].tenDoan + '</td>'
        + '<td class="data-text">' + (this.pitems[i].truongDoan == null ? "" : this.pitems[i].truongDoan) + '</td>'
        + '<td class="data-text">' + this.pitems[i].quocGia + '</td>'
        + '<td class="data-text">' + (this.pitems[i].mucDichHD == null ? "" : this.pitems[i].mucDichHD) + '</td>'
        + '<td class="data-text" style="text-align:center">' + (this.pitems[i].ngayNC == null ? "" : this.pitems[i].ngayNC) + '</td>'
        + '<td class="data-text" style="text-align:center">' + (this.pitems[i].ngayXC == null ? "" : this.pitems[i].ngayXC) + '</td>'
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
                  <div class="title_head"><b>BÁO CÁO DANH SÁCH ĐOÀN VÀO</b></div>
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
            <th scope="col" class="text-center" style="width:4%"><span>STT</span></th>
            <th scope="col" class="text-center" style="width:20%"><span>Tên đoàn</span> </th>
            <th scope="col" class="text-center" style="width:10%"><span>Trưởng đoàn</span> </th>
            <th scope="col" class="text-center" style="width:9%"><span>Quốc gia</span></th>
            <th scope="col" class="text-center" style="width:20%">
              <span>Mục đích hoạt động</span>
            </th>
            <th scope="col" class="text-center" style="width:9%">
              <span>Ngày nhập cảnh</span> 
            </th>
            <th scope="col" class="text-center" style="width:9%">
                <span>Ngày xuất cảnh</span> 
            </th>
            <th scope="col" class="text-center" style="width:4%">
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
        <b><i>Tổng số đoàn vào: </i></b><b><i>${this.ptotalItems}</i></b>
    </div>
    <div class="title">
        <b><i>Tổng số thành viên: </i></b><b><i>${tongSoTV}</i></b>
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
      { header: 'Tên đoàn', key: 'tenDoan', width: 30 },
      // { header: 'Chức vụ', key: 'chucVu', width: 20 },
      { header: 'Trưởng đoàn', key: 'truongDoan', width: 15 }, //style: { font: { name: 'Arial Black', color: { argb: 'FF0000' } } }
      { header: 'Quốc gia', key: 'quocGia', width: 10 },
      { header: 'Mục đích hoạt động', key: 'mDHD', width: 20 },
      { header: 'Ngày xuất cảnh', key: 'ngayXC', width: 15 },
      { header: 'Ngày nhập cảnh', key: 'ngayNC', width: 15 }, //style: { numFmt: 'dd/mm/yyyy' }
      { header: 'Số lượng thành viên', key: 'sluongTV', width: 18 },
    ];

    for (let i = 0; i < this.eitems.length; i++) {
      let tenQuocGiaEx = '';

      worksheet.addRow({
        soTt: i + 1,
        tenDoan: this.eitems[i].tenDoan,
        truongDoan: this.eitems[i].truongDoan,
        // chucVu: this.eitems[i].chucVu,
        quocGia: this.eitems[i].quocGia,
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
            vertical: 'middle', horizontal: 'center', wrapText: true
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

        for (var i = 1; i < 9; i++) {
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
          footerCell.value = 'Tổng số đoàn vào: ' + totalEX;
          footerCell.font = { color: { argb: 'black' }, italic: true, bold: true,name: 'Times New Roman', size: 10,};
          footerCell.alignment = { horizontal: 'left' };
          const footerCell1 = worksheet.getRow(footerRowIndex + 1).getCell(2);
          footerCell1.value = 'Tổng số thành viên: ' + tsTV;
          footerCell1.font = { color: { argb: 'black' }, italic: true, bold: true, name: 'Times New Roman', size: 10,};
          footerCell1.alignment = { horizontal: 'left' };
        }


      });
    });
    let fileName = "BC_DSDoanVao" + '_' + new Date().getTime() + ".xlsx";
    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer()
      .then(function (buffer) {
        // done buffering
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(data, fileName);
      });
  }
  downloadFileAll(maDoan: string, name: string) {
    this.userService.downloadFileAll(maDoan).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      FileSaver.saveAs(blob, maDoan + "_" + name);
    }), (error: any) => console.log('Error downloading the file');
  }

  opentModalTtinTV(maDoan: string) {
    const dialogRef = this.modalService.open(ListTVComponent, {
      size: 'xl',
      centered: true,
    });
    dialogRef.componentInstance.maDoan = maDoan;
    dialogRef.result.then(
      result => {
        console.log('Closed');
      },
      reason => {
        console.log('Dismissed');
      }
    );
  }


  fieldsTV = {
    maHSDoan: '',
  };
  filterTV = {};
  PopUp(event: Event, element: HTMLDivElement, maDoan: string) {
    this.maDoanSearchTV = maDoan;
    this.isLoading = true;
    this.qltvService
      .query({
        page: this.pageTV - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<QuanLyTV[]>) => {
          this.qlyTV = res.body;
          this.isLoading = false;
          this.fieldsTV.maHSDoan = this.maDoanSearchTV.toString();
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
    //this.router.navigateByUrl('/doanVao/quanLyTV/new', { state: chiTietDoan });
    sessionStorage.setItem('currentMaDoan', chiTietDoan.maDoan)
    this.qltvService.getMaDoan(chiTietDoan.maDoan)
    this.router.navigateByUrl(`/doanVao/quanLyTV/new/${chiTietDoan.maDoan}`, { state: chiTietDoan });
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

