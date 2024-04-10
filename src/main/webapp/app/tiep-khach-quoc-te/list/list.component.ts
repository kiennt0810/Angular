import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC } from 'app/config/navigation.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { TiepkhachquocteService } from '../service/tiepkhachquoctet.service';
import { TKQTThongTinVM } from '../TKQTThongTinVM.model';
import { DeleteComponent } from '../delete/delete.component';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import FileSaver from 'file-saver';
import Excel from "exceljs/dist/exceljs.min.js";
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { SessionStorageService } from 'ngx-webstorage';
import { ChucVuService } from 'app/quanlydanhmuc/ChucVu/ChucVu.service';
import { ChucVu } from 'app/quanlydanhmuc/ChucVu/ChucVu.model';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

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
  items: TKQTThongTinVM[] | null = null;
  pitems: TKQTThongTinVM[] | null = null;
  eitems: TKQTThongTinVM[] | null = null;
  ExPrItem: TKQTThongTinVM[] | null = null;
  tempLstChucVu: TKQTThongTinVM[] | null = null;
  tempLstChucVuFlag: TKQTThongTinVM[] | null = null;
  customers: any[];
  isLoading = false;
  totalItems = 0;
  ptotalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  totalPage = 0;
  checkChangePage: any;
  quocGia: User[] | null = null;
  chucVu: string[] | null = ['Tất cả'];
  nameModule = "việc lãnh đạo Đảng tiếp khách";
  currentDate = new Date();
  showWarning1 = false;
  showWarning2 = false;
  showWarning3 = false;
  isEvent: boolean = false;
  currentPath: string;
  roles: string;
  checkAuth = false;
  fullAuth = false;
  userName: string = this.sessionStorageService.retrieve('userName');
  selectedValue: string[] = [];
  allSelected = false;
  constructor(
    private Service: TiepkhachquocteService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private http: HttpClient,
    private alert: AlertServiceCheck,
    private qGService: QuocgiavavunglanhthoService,
    private NavbarService: NavBarService,
    private sessionStorageService: SessionStorageService,
    private ChucVuService: ChucVuService,
  ) {     this.selectedValue = ['Tất cả']
}

  @ViewChild('select') select: MatSelect;

 
  optionClick() {
    if (this.selectedValue == null) {
      console.log('dasdas')
    }
     let newStatus = true;
     if (this.selectedValue.includes('Tất cả')) {
       this.selectedValue = this.selectedValue.filter(item => item !== 'Tất cả');
       this.select.options.forEach((item: MatOption) => {
        if (!item.selected) {
         newStatus = false;
       }
       });
       this.allSelected = newStatus;
     }
     if (this.select.value.length == (this.chucVu.length + 1)) {
      this.allSelected = true;
      this.selectedValue = ['Tất cả']
     }
  }

  allItem = 'Tất cả'
  fields = {
    lanhDao: '',
    doanKhach: '',
    diaDiem: '',
    quocGia: null,
    thoiGianTu: '',
    thoiGianDen: '',
    nam: '',
    chucVu: null,
  };
  filter = {};

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => (this.currentAccount = account));
    if (this.currentAccount == undefined) {
      this.router.navigate(['/login']);
    }
    console.log(this.allSelected)
    this.qGService
      .getAll()
      .subscribe({
        next: (res: HttpResponse<User[]>) => {
          this.onSuccessQG(res.body, res.headers);
        },
      });
    this.handleNavigation();
    this.loadAllChucVu();
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
    this.quocGia = qG;
  }

  unCheckOrthers() {
    if (this.selectedValue.includes('Tất cả')) {
      this.selectedValue = ['Tất cả'];
      this.allSelected = true;
    }
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
  }
  }
  loadAllChucVu(): void {
    this.ChucVuService.getLstChucVu().subscribe({
      next: (res: HttpResponse<ChucVu[]>) => {
        this.onSuccessLstChucVu(res.body);
      }
    });
  }
  private onSuccessLstChucVu(chucVu: ChucVu[] | null): void {
    this.chucVu = chucVu.map(item => item.chucVu);
    console.log(this.chucVu);
  }
  validateDateInput(inputValue: string) {
    var dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(inputValue)) {
      this.alert.warn('Invalid date format. Please use dd/mm/yyyy.');
    }
  }

  updateFilters() {
    const dk = sessionStorage.getItem('dktk');
    const cv = sessionStorage.getItem('chucVu');
    this.allSelected = false
    if (cv.includes('Tất cả')) {
      this.allSelected = true;
    }
    if (dk && dk !== "{}") {
      this.ExPrItem = this.items;
      this.filter = JSON.parse(dk);
      this.fields = JSON.parse(dk);
      this.selectedValue = JSON.parse(cv);
      if (this.selectedValue.length < 1 || this.allSelected) {
        this.ExPrItem = this.items;
        this.ExPrItem = this.transform(this.ExPrItem, this.filter);
        }
        else {
          let b = []
          this.selectedValue.forEach(chucVuCanTim => {
          let a = this.items.filter(item => 
            item.chucVu == chucVuCanTim
          )
          a.forEach(item => 
            b.push(item))
          })
          this.ExPrItem = b;
          this.ExPrItem = this.transform(this.ExPrItem, this.filter);
        }
        this.totalItems = Number(this.ExPrItem.length);
        this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    } else {
      if ((this.fields.thoiGianTu != undefined && this.fields.thoiGianDen != undefined)
      && (this.fields.thoiGianDen != '' && this.fields.thoiGianTu != '')
      && (this.fields.thoiGianTu > this.fields.thoiGianDen)) {
      this.alert.warn('Đến ngày phải lớn hơn từ ngày');
      $('#thoiGianDen').focus();
      } else {
        this.fields.thoiGianTu = $('#thoiGianTu').first().val().trim();
        this.fields.thoiGianDen = $('#thoiGianDen').first().val().trim();
        this.fields.lanhDao = $('#lanhDao').first().val().trim();
        this.fields.diaDiem = $('#diaDiem').first().val().trim();
        this.fields.doanKhach = $('#doanKhach').first().val().trim();
        this.fields.nam = $('#nam').first().val().trim();
        Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
        this.filter = Object.assign({}, this.fields);
        this.page = 1;
        this.ExPrItem = this.transform(this.ExPrItem, this.filter);
        this.totalItems = Number(this.ExPrItem.length);
        this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
      }
    }
  }

  search() {
    this.allSelected = false;
    this.unCheckOrthers()
    sessionStorage.removeItem('dktk')
    if ((this.fields.thoiGianTu != undefined && this.fields.thoiGianDen != undefined)
      && (this.fields.thoiGianDen != '' && this.fields.thoiGianTu != '')
      && (this.fields.thoiGianTu > this.fields.thoiGianDen)) {
      this.alert.warn('Đến ngày phải lớn hơn từ ngày');
      $('#thoiGianDen').focus();
    } else {
        this.fields.thoiGianTu = $('#thoiGianTu').first().val().trim();
        this.fields.thoiGianDen = $('#thoiGianDen').first().val().trim();
        this.fields.lanhDao = $('#lanhDao').first().val().trim();
        this.fields.diaDiem = $('#diaDiem').first().val().trim();
        this.fields.doanKhach = $('#doanKhach').first().val().trim();
        this.fields.nam = $('#nam').first().val().trim();
        Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
        this.filter = Object.assign({}, this.fields);
        this.page = 1;
        if (this.selectedValue.length < 1 || this.allSelected) {
        this.ExPrItem = this.items;
        this.ExPrItem = this.transform(this.ExPrItem, this.filter);
        }
        else {
          let b = []
          this.selectedValue.forEach(chucVuCanTim => {
          let a = this.items.filter(item => 
            item.chucVu == chucVuCanTim
          )
          a.forEach(item => 
            b.push(item))
          })
          this.ExPrItem = b;
          this.ExPrItem = this.transform(this.ExPrItem, this.filter);
        }
        this.totalItems = Number(this.ExPrItem.length);
        this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    }
  }

  deleteTKQT(deleteTKQT: TKQTThongTinVM): void {
    if (this.fullAuth == true) {
      const modalRef = this.modalService.open(DeleteComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.user = deleteTKQT;
      modalRef.closed.subscribe(reason => {
        if (reason === 'deleted') {
          this.loadAll();
        }
      });
    } else if (String(deleteTKQT.createdBy) == String(this.userName)) {
      const modalRef = this.modalService.open(DeleteComponent, { size: 'lg', backdrop: 'static' });
      modalRef.componentInstance.user = deleteTKQT;
      modalRef.closed.subscribe(reason => {
        if (reason === 'deleted') {
          this.loadAll();
        }
      });
    } else {
      this.alert.warn('Bạn chỉ được xóa dữ liệu do chính mình tạo ra!');
    }
  }

  editTKQT(item: TKQTThongTinVM): void {
    if (this.fullAuth == true) {
      this.router.navigate(['/tiep-khach-quoc-te/edit', item.id]);
    } else if (String(item.createdBy) == String(this.userName)) {
      this.router.navigate(['/tiep-khach-quoc-te/edit', item.id]);
    } else {
      this.alert.warn('Bạn chỉ được sửa dữ liệu do chính mình tạo ra!');
    }
  }



  async loadAll(): Promise<void> {
    this.isLoading = true;
    try {
      const res: HttpResponse<TKQTThongTinVM[]> = await this.Service
        .query({
          page: this.page - 1,
          size: this.itemsPerPage,
          sort: this.sort(),
        })
        .toPromise();
      this.isLoading = false;
      this.onSuccess(res.body, res.headers);
    } catch (error) {
      console.error('Error fetching data:', error);
      this.isLoading = false;
      // Handle the error
    }
  }


  loadDataPrint(): void {
    this.isLoading = true;
    this.Service
      .query()
      .subscribe({
        next: (res: HttpResponse<TKQTThongTinVM[]>) => {
          this.isLoading = false;
          this.onPrintSuccess(res.body, res.headers);
          this.search();
          this.pitems = this.ExPrItem;
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
        next: (res: HttpResponse<TKQTThongTinVM[]>) => {
          this.isLoading = false;
          this.onExportSuccess(res.body, res.headers);
          this.search();
          this.eitems = this.ExPrItem;
          this.export();
        },
        error: () => (this.isLoading = false),
      });


  }

  isInvalidDate1(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY');
      event.target.value = null
      $('#thoiGianTu').focus();
    }

  }

  isInvalidDate2(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY');
      event.target.value = null
      $('#thoiGianDen').focus();
    }

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



  onScroll(event: Event) {
    if (event) {
      this.isEvent = true;
    }
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

  private onSuccess(items: TKQTThongTinVM[] | null, headers: HttpHeaders): void {
    this.items = items;
    this.ExPrItem = this.items;
    for (let i = 0; i < this.ExPrItem.length; i++) {
      if (String(this.ExPrItem[i].chucVu) == 'null') {
        this.ExPrItem[i].chucVu = '';
      }

    }
    this.totalItems = Number(this.ExPrItem.length);
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateFilters()
  }

  private onPrintSuccess(pitems: TKQTThongTinVM[] | null, headers: HttpHeaders): void {
    this.pitems = pitems;
  }

  private onExportSuccess(eitems: TKQTThongTinVM[] | null, headers: HttpHeaders): void {
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
          delete this.filter[keyName];
          sessionStorage.setItem('dktk', dk);
          return true;
        } else if (keyName === 'chucVu' && (filter[keyName] === null || filter[keyName] === '')) {
          filter[keyName] = '';
          delete this.filter[keyName];
          sessionStorage.setItem('dktk', dk);
          sessionStorage.setItem('chucVu', JSON.stringify(this.selectedValue));
          return true;
        } else {
          // this.fields.chucVu = this.selectedValue;
          sessionStorage.setItem('dktk', dk);
          sessionStorage.setItem('chucVu', JSON.stringify(this.selectedValue));
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
      lanhDao: '',
      diaDiem: '',
      doanKhach: '',
      nam: '',
      quocGia: null,
      thoiGianTu: '',
      thoiGianDen: '',
      chucVu: null,
    };
    this.selectedValue = [];
    // Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
    // this.filter = Object.assign({}, this.fields);
    // this.ExPrItem = this.items;
    // this.ExPrItem = this.transform(this.ExPrItem, this.filter);
    // this.totalItems = Number(this.ExPrItem.length);
    // this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    
  }
  redirectTo() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([''])
    });
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
      { header: 'Lãnh đạo tiếp khách', key: 'lanhDao', width: 20 },
      { header: 'Chức vụ', key: 'chucVu', width: 15 },
      { header: 'Tên đoàn khách', key: 'doanKhach', width: 25 },
      { header: 'Quốc gia', key: 'quocGia', width: 10 },
      { header: 'Địa điểm', key: 'diaDiem', width: 10 },
      { header: 'Hình thức tiếp khách', key: 'hinhThuc', width: 18 },
      { header: 'Thời gian tiếp khách', key: 'thoiGian', width: 20 },
    ];
    let thoiGian: string = "";
    for (let i = 0; i < this.eitems.length; i++) {
      if (String(this.eitems[i].thoiGianTu) == '' && String(this.eitems[i].thoiGianDen) == '') {
        thoiGian = '';
      } else {
        thoiGian = this.eitems[i].thoiGianTu + ' - ' + this.eitems[i].thoiGianDen;
      }
      worksheet.addRow({
        soTt: i + 1,
        lanhDao: this.eitems[i].lanhDao,
        chucVu: this.eitems[i].chucVu,
        doanKhach: this.eitems[i].doanKhach,
        quocGia: this.eitems[i].quocGia,
        diaDiem: this.eitems[i].diaDiem,
        hinhThuc: this.eitems[i].hinhThuc,
        thoiGian: thoiGian
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
          worksheet.getCell('H' + [i]).alignment = {
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

    let fileName = "Danh_sách_khách_quốc_tế.xlsx";
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
    let dataSK: string = "";
    let dsearch: string = "";
    let dataString: string = "";
    let thoiGian: string = "";
    for (let i = 0; i < this.ptotalItems; i++) {
      if (String(this.pitems[i].thoiGianTu) == '' && String(this.pitems[i].thoiGianDen) == '') {
        thoiGian = '';
      } else {
        thoiGian = this.pitems[i].thoiGianTu + ' - ' + this.pitems[i].thoiGianDen;
      }

      dataString = dataString + '<tr>'
        + '<td class="text-center">' + (i + 1) + '</td>'
        + '<td class="data-text">' + this.pitems[i].lanhDao + '</td>'
        + '<td class="data-text">' + this.pitems[i].chucVu + '</td>'
        + '<td class="data-text">' + this.pitems[i].doanKhach + '</td>'
        + '<td  class="data-text">' + this.pitems[i].quocGia + '</td>'
        + '<td class="data-text">' + (this.pitems[i].diaDiem == null ? "" : this.pitems[i].diaDiem) + '</td>'
        + '<td class="data-text">' + (this.pitems[i].hinhThuc == null ? "" : this.pitems[i].hinhThuc) + '</td>'
        + '<td scope="col" class="data-text" style="text-align: center;">' + thoiGian + '</td>'
      '</tr>';
    }
    var nam = $('#nam').first().val();
    var lanhDao = $('#lanhDao').first().val();
    var diaDiem = $('#diaDiem').first().val();
    if (lanhDao != '') {
      dsearch = 'Lãnh đạo : ' + lanhDao;
    }
    if (diaDiem != '') {
      dsearch = 'Địa điểm : ' + diaDiem;
    }
    if (nam != '') {
      dsearch = 'Năm : ' + nam;
    }
    if ((lanhDao != '' && nam == '' && diaDiem == '') ||
      (lanhDao == '' && nam != '' && diaDiem == '') ||
      (lanhDao == '' && nam == '' && diaDiem != '')) {
      dataSK = dataSK + '<tr>'
        + '<td colspan="2" style="text-align: center;">'
        + '<div class="title">' + dsearch + '</div>'
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
                  <div class="title_head"><b>BÁO CÁO THỐNG KÊ VIỆC LÃNH ĐẠO ĐẢNG TIẾP KHÁCH QUỐC TẾ</b></div>
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
            <th scope="col" class="text-center" style="width:4%"><span>STT</span></th>
            <th scope="col" class="text-center" style="width:10%"><span>Lãnh đạo tiếp khách</span> </th>
            <th scope="col" class="text-center" style="width:12%"><span>Chức vụ</span> </th>
            <th scope="col" class="text-center" style="width:12%"><span>Tên đoàn khách</span></th>
            <th scope="col" class="text-center" style="width:6%"><span>Quốc gia</span></th>
            <th scope="col" class="text-center" style="width:6%"><span>Địa điểm</span></th>
            <th scope="col" class="text-center" style="width:11%"><span>Hình thức tiếp khách</span></th>
            <th scope="col" class="text-center" style="width:12%;"><span>Thời gian tiếp khách</span></th>
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
