import { Component, Injectable, OnInit } from '@angular/core';
import { HttpResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT } from 'app/config/navigation.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { NgoaiGiaoDoanService } from '../service/ngoai-giao-doan.service';
import { HDNgoaiGiaoVM } from '../HDNgoaiGiaoVM.model';
import { NgoaiGiaoDoanModule } from '../ngoai-giao-doan.module';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { formatDate } from '@angular/common';
import { DeleteComponent } from '../delete/delete.component';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import moment from 'moment';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { SessionStorageService } from 'ngx-webstorage';


declare var $: any;
@Component({
  selector: 'jhi-user',
  templateUrl: './list.component.html',
  styleUrls: ['../../income.component.scss', './list.component.scss'],
  providers: [
  ],

})
export class ListComponent implements OnInit {
  currentAccount: Account | null = null;
  items: HDNgoaiGiaoVM[] | null = null;
  pitems: HDNgoaiGiaoVM[] | null = null;
  eitems: HDNgoaiGiaoVM[] | null = null;
  ExPrItem: HDNgoaiGiaoVM[] | null = null;
  quocGia: User[] | null = null;
  customers: any[];
  isLoading = false;
  totalItems = 0;
  ptotalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  currentDate = new Date();
  nameModule = "hoạt động";
  totalPage = 0;
  formatDateTG: boolean;
  showWarning = false;
  currentPath: string;
  roles: string;
  checkAuth = false;
  userName: string = this.sessionStorageService.retrieve('userName');
  fullAuth = false;
  constructor(
    private Service: NgoaiGiaoDoanService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private http: HttpClient,
    private qGService: QuocgiavavunglanhthoService,
    private NavbarService: NavBarService,
    private alert: AlertServiceCheck,
    private sessionStorageService: SessionStorageService,
  ) { }

  fields = {
    tenHD: '',
    coQuan: '',
    diaDiem: '',
    quocGia: null,
    thoiGian: '',
    nam: '',
  };
  filter = {};

  citems: any[];
  url: string = '/assets/Countries.json';
  ngOnInit(): void {
    this.qGService.getAll().subscribe({
      next: (res: HttpResponse<User[]>) => {
        this.onSuccessQG(res.body, res.headers);
      },
    });
    this.handleNavigation();
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


  updateFilters() {
    const dk = sessionStorage.getItem('dktk')
    if (dk && dk !== "{}") {
      this.ExPrItem = this.items;
      this.filter = JSON.parse(dk);
      this.fields = JSON.parse(dk);
      this.ExPrItem = this.transform(this.ExPrItem, this.filter);
      this.totalItems = Number(this.ExPrItem.length);
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    } else {
      this.fields.thoiGian = $('#thoiGian').first().val();
      this.fields.coQuan = $('#coQuan').first().val().trim();
      this.fields.diaDiem = $('#diaDiem').first().val().trim();
      this.fields.nam = $('#nam').first().val().trim();
      this.fields.tenHD = $('#tenHD').first().val().trim();
      Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
      this.filter = Object.assign({}, this.fields);
      this.ExPrItem = this.items;
      this.ExPrItem = this.transform(this.ExPrItem, this.filter);
      this.totalItems = Number(this.ExPrItem.length);
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    }
    
  }


  search() {
    sessionStorage.removeItem('dktk');
    this.fields.thoiGian = $('#thoiGian').first().val();
    this.fields.coQuan = $('#coQuan').first().val().trim();
    this.fields.diaDiem = $('#diaDiem').first().val().trim();
    this.fields.nam = $('#nam').first().val().trim();
    this.fields.tenHD = $('#tenHD').first().val().trim();
    Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
    this.filter = Object.assign({}, this.fields);
    this.page = 1;
    this.ExPrItem = this.items;
    this.ExPrItem = this.transform(this.ExPrItem, this.filter);
    this.totalItems = Number(this.ExPrItem.length);
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  deleteHDNG(user: HDNgoaiGiaoVM): void {
    if (this.fullAuth == true) {
      const modalRef = this.modalService.open(DeleteComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.user = user;
      modalRef.closed.subscribe(reason => {
        if (reason === 'deleted') {
          this.loadAll();
        }
      });
    } else if (String(user.createdBy) == String(this.userName)) {
      const modalRef = this.modalService.open(DeleteComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.user = user;
      modalRef.closed.subscribe(reason => {
        if (reason === 'deleted') {
          this.loadAll();
        }
      });
    } else {
      this.alert.warn('Bạn chỉ được xóa dữ liệu do chính mình tạo ra!');
    }
  }

  EditHDNG(item: HDNgoaiGiaoVM): void {
    if (this.fullAuth == true) {
      this.router.navigate(['/ngoai-giao-doan/edit', item.id]);
    } else if (String(item.createdBy) == String(this.userName)) {
      this.router.navigate(['/ngoai-giao-doan/edit', item.id]);
    } else {
      this.alert.warn('Bạn chỉ được sửa dữ liệu do chính mình tạo ra!');
    }
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
  loadAll(): void {
    this.isLoading = true;
    this.Service
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<HDNgoaiGiaoVM[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
        },
        error: () => (this.isLoading = false),
      });


  }
  loadDataPrint(): void {
    this.isLoading = true;
    this.Service
      .query()
      .subscribe({
        next: (res: HttpResponse<HDNgoaiGiaoVM[]>) => {
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
    this.Service
      .query()
      .subscribe({
        next: (res: HttpResponse<HDNgoaiGiaoVM[]>) => {
          this.isLoading = false;
          this.onExportSuccess(res.body, res.headers);
          this.updateFilters();
          this.eitems = this.transform(this.eitems, this.filter);
          this.export();
        },
        error: () => (this.isLoading = false),
      });


  }
  transition(): void {
    console.log(this.page);
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
  private onSuccessQG(qG: User[] | null, headers: HttpHeaders): void {
    this.quocGia = qG;
  }
  private onSuccess(items: HDNgoaiGiaoVM[] | null, headers: HttpHeaders): void {
    this.items = items;
    this.ExPrItem = this.items;
    this.totalItems = Number(this.ExPrItem.length);
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    for (let index = 0; index < this.items.length; index++) {
      if (String(this.items[index].quocGia) == 'null') {
        this.items[index].quocGia = '';
      }
    }
    this.updateFilters();
  }
  private onPrintSuccess(pitems: HDNgoaiGiaoVM[] | null, headers: HttpHeaders): void {
    this.pitems = pitems;
  }

  private onExportSuccess(eitems: HDNgoaiGiaoVM[] | null, headers: HttpHeaders): void {
    this.eitems = eitems;
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

  deleteCondition() {
    this.fields = {
      tenHD: '',
      coQuan: '',
      diaDiem: '',
      nam: '',
      quocGia: null,
      thoiGian: '',
    };

    // Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
    // this.filter = Object.assign({}, this.fields);
    // this.ExPrItem = this.items;
    // this.filter = Object.assign({}, this.fields);
    // this.ExPrItem = this.transform(this.ExPrItem, this.filter);
    // this.totalItems = Number(this.ExPrItem.length);
    // this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    // if (this.fields.quocGia == undefined || this.fields.quocGia == '') {
    //   $('#quocGia').val(null);
    // }
  }


  export() {
    let totalEX = this.eitems.length;
    var options = {
      useStyles: true,
      useSharedStrings: true
    };
    let workbook = new Excel.Workbook(options);
    var worksheet = workbook.addWorksheet('My Sheet', { properties: { tabColor: { argb: 'FFC0000' } } });
    worksheet.columns = [
      { header: 'STT', key: 'soTt', width: 5 },
      { header: 'Tên hoạt động', key: 'tenHD', width: 35 },
      { header: 'Cơ quan đại diện', key: 'coQuan', width: 15 },
      { header: 'Quốc gia tổ chức', key: 'quocGia', width: 15 },
      { header: 'Hình thức', key: 'hinhThuc', width: 15 },
      { header: 'Thời gian', key: 'thoiGian', width: 15 },
      { header: 'Địa điểm', key: 'diaDiem', width: 15 },
      { header: 'Ghi chú', key: 'ghiChu', width: 15 },
    ];

    for (let i = 0; i < this.eitems.length; i++) {
      if (String(this.eitems[i].quocGia) == 'null') {
        this.eitems[i].quocGia = '';
      }
      worksheet.addRow({
        soTt: i + 1,
        tenHD: this.eitems[i].tenHD,
        coQuan: this.eitems[i].coQuan,
        quocGia: this.eitems[i].quocGia,
        hinhThuc: this.eitems[i].hinhThuc,
        thoiGian: this.eitems[i].thoiGian,
        diaDiem: this.eitems[i].diaDiem,
        ghiChu: this.eitems[i].ghiChu,

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
          vertical: 'middle', horizontal: 'left', wrapText: true
        };
        for (let i = 2; i < totalEX + 2; i++) {
          worksheet.getCell('A' + [i]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('F' + [i]).alignment = {
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
            row.getCell(i).alignment = {
              vertical: 'middle', horizontal: 'center', wrapText: true
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
          footerCell.value = 'Tổng số: ' + totalEX;
          footerCell.font = { color: { argb: 'black' }, italic: true, bold: true, name: 'Times New Roman' };
          footerCell.alignment = { horizontal: 'left' };
        }


      });
    });

    let fileName = "Danh_sách_ngoại_giao_đoàn.xlsx";
    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer()
      .then(function (buffer) {
        // done buffering
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(data, fileName);
      });
  }
  print(): void {
    const cValue = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
    const printWindow = window.open('', 'PRINT');
    let dataString: string = "";
    let dataSK: string = "";
    for (let i = 0; i < this.ptotalItems; i++) {
      dataString = dataString + '<tr>'
        + '<td class="text-center">' + (i + 1)
        + '</td>'
        + '<td class="data-text">' + this.pitems[i].tenHD + '</td>'
        + '<td class="data-text">' + this.pitems[i].coQuan + '</td>'
        + '<td class="data-text">' + (String(this.pitems[i].quocGia) == 'null' ? '' : this.pitems[i].quocGia)  + '</td>'
        + '<td class="data-text">' + (this.pitems[i].hinhThuc == null ? "" : this.pitems[i].hinhThuc) + '</td>'
        + '<td class="data-text" style="text-align:center">' + (this.pitems[i].thoiGian == null ? "" : this.pitems[i].thoiGian) + '</td>'
        + '<td scope="col" class="data-text">' + (this.pitems[i].diaDiem == null ? "" : this.pitems[i].diaDiem) + '</td>'
        + '<td scope="col" class="data-text">' + (this.pitems[i].ghiChu == null ? "" : this.pitems[i].ghiChu) + '</td>'
      '</tr>';
    }
    var thoiGian = $('#thoiGian').first().val();
    var nam = $('#nam').first().val();
    if (thoiGian == '' && nam != '') {
      dataSK = '<tr>'
        + '<td colspan="2" style="text-align: center;">'
        + '<div class="title">Năm : ' + this.fields.nam + '</div>'
        + '</td>'
        + '</tr>';
    }
    if (thoiGian != '') {
      dataSK = '<tr>'
        + '<td colspan="2" style="text-align: center;">'
        + '<div class="title">Thời gian : ' + this.fields.thoiGian + '</div>'
        + '</td>'
        + '</tr>';
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
                  <div class="title_head"><b>BÁO CÁO THỐNG KÊ HOẠT ĐỘNG NGOẠI GIAO ĐOÀN</b></div>
                </td>
            </tr>  
            ${dataSK}
                  
          </table>
          </div>
          <br>
    <div class="table-responsive" style="width:1123px">
      <table class="table table-striped" aria-describedby="user-management-page-heading" style="width:1123px" border="1">
        <thead>
          <tr >
            <th scope="col" class="text-center" style="width:2%"><span>STT</span></th>
            <th scope="col" class="text-center" style="width:20%"><span>Tên hoạt động</span></th>
            <th scope="col" class="text-center" style="width:10%"><span>Cơ quan đại diện</span></th>
            <th scope="col" class="text-center" style="width:9%"><span>Quốc gia tổ chức</span></th>
            <th scope="col" class="text-center" style="width:10%"><span>Hình thức</span></th>
            <th scope="col" class="text-center" style="width:7%"><span>Thời gian</span></th>
            <th scope="col" class="text-center" style="width:15%"><span>Địa điểm</span></th>
            <th scope="col" class="text-center" style="width:12%"><span>Ghi chú</span></th>
          </tr>
        </thead>
        <tbody>
        ${dataString}
        </tbody>
      </table>
    </div>
    <br>
    <div class="title">
        <b><i>Tổng số : ${this.ptotalItems}</i></b>
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
}
