import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC } from 'app/config/navigation.constants';
import { HChieuNGService } from '../service/hoCNgoaiGiao.service';
import { HoChieuNgoaiGiao } from '../hoCNgoaiGiao.model';
import { GiaoNhanHCService } from 'app/quanLyHoChieu/quanlyGiaoNhanHC/service/giaoNhanHC.service';

import { HCNGDeleteDialogComponent } from '../quanLyHCNgoaiGiao-delete/hoCNG-delete.component';
import FileSaver from 'file-saver';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { formatDate } from '@angular/common';
import { GiaoNhanHC } from 'app/quanLyHoChieu/quanlyGiaoNhanHC/giaoNhanHC.model';
import { DeleteCheckComponent } from '../delete-check/delete-check.component';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { THOI_GIAN_HIEU_LUC } from 'app/app.constants';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { SessionStorageService } from 'ngx-webstorage';

declare var $: any;
@Component({
  selector: 'jhi-hoCNgoaiGiao-mgmt',
  templateUrl: './hoCNgoaiGiao.component.html',
  styleUrls: ['./hoCNG.component.scss'],
})
export class HChieuNGComponent implements OnInit {
  hoChieus: HoChieuNgoaiGiao[] | null = null;
  pitems: HoChieuNgoaiGiao[] | null = null;
  searchItem: HoChieuNgoaiGiao[] | null = null;
  ExPrItem: HoChieuNgoaiGiao[] | null = null;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  ConHan = 0;
  SapHetHan = 0;
  HetHan = 0;
  ptotalItems = 0;
  exportItems: HoChieuNgoaiGiao[] | null = null;
  exprotTotal = 0;
  nameModule = 'hộ chiếu';
  totalPage = 0;

  currentAccount: Account | null = null;
  checkNgayHL: string = this.sessionStorageService.retrieve('ThoiHanHC');

  giaoNhanHCs: GiaoNhanHC[] | null = null;
  totalGnHc = 0;

  totalsTVDoanRa = 0;
  checkLoadList = false;

  checkChangePage: any;
  currentPath: string;

  roles: string;
  checkAuth = false;
  fullAuth = false;
  userName: string = this.sessionStorageService.retrieve('userName');

  constructor(
    private HChieuNGService: HChieuNGService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private GiaoNhanHCService: GiaoNhanHCService,
    private alert: AlertServiceCheck,
    private accountService: AccountService,
    private NavbarService: NavBarService,
    private sessionStorageService: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.checkChangePage = 0;
    this.accountService.identity().subscribe(account => (this.currentAccount = account));
    if (this.currentAccount == undefined) {
      this.router.navigate(['/login']);
    }
    this.handleNavigation();
    this.loadAllGnHoChieu();
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

  loadAll(): void {
    this.isLoading = true;
    this.HChieuNGService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<HoChieuNgoaiGiao[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
        },
        error: () => (this.isLoading = false),
      });


  }

  onEditClick(id: number) {
    const element = this.hoChieus.find((p) => { return p.id === id });

  }
  fields = {
    hoTen: '',
    cmndSo: '',
    soHC: '',
    trangThai: null
  };
  filter = {};

  updateFilters() {
    const dk = sessionStorage.getItem('dktk');
    if (dk && dk !== "{}") {
      this.ExPrItem = this.hoChieus;
      this.filter = JSON.parse(dk);
      this.fields = JSON.parse(dk);
      this.ExPrItem = this.transform(this.ExPrItem, this.filter);
      this.totalItems = Number(this.ExPrItem.length);
      if (this.totalItems <= 0) {
        this.checkLoadList = true;
      }
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
      this.page = 1;
    } else {
      this.checkLoadList = false;
      Object.keys(this.fields).forEach((key) => {
        if (key !== 'trangThai') {
          this.fields[key] = this.fields[key].trim();
        }
      });
      Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
      this.ExPrItem = this.hoChieus;
      this.filter = Object.assign({}, this.fields);
      this.ExPrItem = this.transform(this.ExPrItem, this.filter);
      this.totalItems = Number(this.ExPrItem.length);
      if (this.totalItems <= 0) {
        this.checkLoadList = true;
      }
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
      this.page = 1;
    }
  }

  search() {
    sessionStorage.removeItem('dktk');
    this.checkLoadList = false;
    Object.keys(this.fields).forEach((key) => {
      if (key !== 'trangThai') {
        this.fields[key] = this.fields[key].trim();
      }
    });
    Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
    this.ExPrItem = this.hoChieus;
    this.filter = Object.assign({}, this.fields);
    this.ExPrItem = this.transform(this.ExPrItem, this.filter);
    this.totalItems = Number(this.ExPrItem.length);
    if (this.totalItems <= 0) {
      this.checkLoadList = true;
    }
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    this.page = 1;
  }

  transition(): void {
    this.checkChangePage = 1;
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

  private onSuccess(hoChieu: HoChieuNgoaiGiao[] | null, headers: HttpHeaders): void {
    this.totalItems = hoChieu.length;
    for (let i = 0; i < hoChieu.length; i++) {
      if (i != 0) {
        hoChieu[0].stt = 1;
        hoChieu[i].stt = hoChieu[i - 1].stt + 1;
      }

      let [day, month, year] = hoChieu[i].cmndNgayHL.split('/');
      const dateNgayHL = new Date(+year, +month - 1, +day);
      const dateHieuluc = new Date(+year, +month - 1, +day);
      dateHieuluc.setMonth(dateHieuluc.getMonth() - Number(this.checkNgayHL));
      const today = new Date();
      var hl = new Date(dateHieuluc.getFullYear(), dateHieuluc.getMonth(), dateHieuluc.getDate());
      var td = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const time = Math.floor(Date.UTC(dateNgayHL.getFullYear(), dateNgayHL.getMonth(), dateNgayHL.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      hoChieu[i].tGianHetHan = (time / (1000 * 3600 * 24)) + 1;
      if (this.checkChangePage == 0) {
        if (hl.getTime() >= td.getTime()) {
          hoChieu[i].trangThai = '0';
          this.ConHan++;
        } else if (hl.getTime() < td.getTime() && hoChieu[i].tGianHetHan > 0) {
          hoChieu[i].trangThai = '1';
          this.SapHetHan++;
        } else if (hoChieu[i].tGianHetHan <= 0) {
          hoChieu[i].trangThai = '2';
          this.HetHan++
        }
      } else if (this.checkChangePage == 1) {
        if (hl.getTime() >= td.getTime()) {
          hoChieu[i].trangThai = '0';
        } else if (hl.getTime() < td.getTime() && hoChieu[i].tGianHetHan > 0) {
          hoChieu[i].trangThai = '1';
        } else if (hoChieu[i].tGianHetHan <= 0) {
          hoChieu[i].trangThai = '2';
        }
      }
      if (String(hoChieu[i].gioiTinh) == 'true') {
        hoChieu[i].gioiTinh = 'Nam';
      } else if (String(hoChieu[i].gioiTinh) == 'false') {
        hoChieu[i].gioiTinh = 'Nữ';
      }
    }
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    this.hoChieus = hoChieu;
    this.ExPrItem = this.hoChieus;
    this.checkLoadList = false;
    this.updateFilters();
  }

  loadAllGnHoChieu(): void {
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
          this.onSuccessGnHc(res.body, res.headers);
        },
        error: () => (this.isLoading = false),
      });
  }



  private onSuccessGnHc(GnHoC: GiaoNhanHC[] | null, headers: HttpHeaders): void {
    this.totalsTVDoanRa = GnHoC.length;
    this.giaoNhanHCs = GnHoC;
  }

  deleteHCNG(hoChieu: HoChieuNgoaiGiao): void {
    var check = true;
    if (this.fullAuth == true) {
      for (let i = 0; i < this.giaoNhanHCs?.length; i++) {
        if (hoChieu.soHC == this.giaoNhanHCs[i].soHoChieu) {
          check = false;
          const modalRef = this.modalService.open(DeleteCheckComponent, { size: 'lg', backdrop: 'static' });
          modalRef.componentInstance.hoChieu = hoChieu;
          break;
        }
      }
      if (check == true) {
        const modalRef = this.modalService.open(HCNGDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.hoChieu = hoChieu;
        modalRef.closed.subscribe(reason => {
          if (reason === 'deleted') {
            this.checkChangePage = 0;
            this.ConHan = 0;
            this.SapHetHan = 0;
            this.HetHan = 0;
            this.loadAll();
            this.alert.success('Xóa thành công');
          }
        });
      }
    } else if (String(hoChieu.createdBy) == String(this.userName)) {
      for (let i = 0; i < this.giaoNhanHCs?.length; i++) {
        if (hoChieu.soHC == this.giaoNhanHCs[i].soHoChieu) {
          check = false;
          const modalRef = this.modalService.open(DeleteCheckComponent, { size: 'lg', backdrop: 'static' });
          modalRef.componentInstance.hoChieu = hoChieu;
          break;
        }
      }
      if (check == true) {
        const modalRef = this.modalService.open(HCNGDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.hoChieu = hoChieu;
        modalRef.closed.subscribe(reason => {
          if (reason === 'deleted') {
            this.checkChangePage = 0;
            this.ConHan = 0;
            this.SapHetHan = 0;
            this.HetHan = 0;
            this.loadAll();
            this.alert.success('Xóa thành công');
          }
        });
      }
    } else {
      this.alert.warn("Bạn chỉ được xóa dữ liệu do chính mình tạo ra!");
    }

  }

  editHCNG(hoChieu: HoChieuNgoaiGiao): void {
    if (this.fullAuth == true) {
      this.router.navigate(['/HoChieu/quanlyHCNgoaiGiao/editPassport', hoChieu.soHC]);
    } else if (String(hoChieu.createdBy) == String(this.userName)) {
      this.router.navigate(['/HoChieu/quanlyHCNgoaiGiao/editPassport', hoChieu.soHC]);
    } else {
      this.alert.warn('Bạn chỉ được sửa dữ liệu do chính mình tạo ra!');
    }
  }



  loadDataExport() {
    this.isLoading = true;
    this.HChieuNGService
      .query()
      .subscribe({
        next: (res: HttpResponse<HoChieuNgoaiGiao[]>) => {
          this.isLoading = false;
          this.onExportSuccess(res.body, res.headers);
          this.updateFilters();
          this.exportItems = this.transform(this.exportItems, this.filter);
          this.exprotTotal = Number(this.exportItems.length);
          this.export();
        },
        error: () => (this.isLoading = false),
      });
  }



  private onExportSuccess(Exitem: HoChieuNgoaiGiao[] | null, headers: HttpHeaders): void {
    for (let i = 0; i < Exitem.length; i++) {
      if (i != 0) {
        Exitem[0].stt = 1;
        Exitem[i].stt = Exitem[i - 1].stt + 1;
      }

      let [day, month, year] = Exitem[i].cmndNgayHL.split('/');
      const dateNgayHL = new Date(+year, +month - 1, +day);
      const dateHieuluc = new Date(+year, +month - 1, +day);
      dateHieuluc.setMonth(dateHieuluc.getMonth() - Number(this.checkNgayHL));
      const today = new Date();
      var hl = new Date(dateHieuluc.getFullYear(), dateHieuluc.getMonth(), dateHieuluc.getDate());
      var td = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const time = Math.floor(Date.UTC(dateNgayHL.getFullYear(), dateNgayHL.getMonth(), dateNgayHL.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      Exitem[i].tGianHetHan = (time / (1000 * 3600 * 24)) + 1;
      if (hl.getTime() >= td.getTime()) {
        Exitem[i].trangThai = '0';
      } else if (hl.getTime() < td.getTime() && Exitem[i].tGianHetHan > 0) {
        Exitem[i].trangThai = '1';
      } else if (Exitem[i].tGianHetHan <= 0) {
        Exitem[i].trangThai = '2';
      }
    }
    this.exportItems = Exitem;
  }

  export() {
    let totalEX = this.exportItems.length;
    var trangThai = "";
    var options = {
      useStyles: true,
      useSharedStrings: true
    };
    let workbook = new Excel.Workbook(options);
    var worksheet = workbook.addWorksheet('My Sheet', { properties: { tabColor: { argb: 'FFC0000' } } });
    worksheet.columns = [
      { header: 'STT', key: 'soTt', width: 5 },
      { header: 'Số hộ chiếu', key: 'soHC' },
      { header: 'Họ và tên', key: 'hoTen', width: 15 }, //style: { font: { name: 'Arial Black', color: { argb: 'FF0000' } } }
      { header: 'Giới tính', key: 'gioiTinh' },
      { header: 'CCCD', key: 'cmndSo' },
      { header: 'Ngày sinh', key: 'ngaySinh' },
      { header: 'Chức vụ', key: 'chucVu', width: 10 }, //style: { numFmt: 'dd/mm/yyyy' }
      { header: 'Cơ quan', key: 'coQuan', width: 12 },
      { header: 'Loại hộ chiếu', key: 'loaiHC', width: 15 },
      { header: 'Ngày cấp', key: 'cmndNgayCap' },
      { header: 'Ngày hết hạn', key: 'cmndNgayHL' },
      { header: 'Thời gian còn lại', key: 'tGianHetHan' },
      { header: 'Trạng thái', key: 'trangThai', width: 10 }
    ];


    for (let i = 0; i < this.exportItems.length; i++) {
      if (this.exportItems[i].trangThai == '0') {
        trangThai = 'Còn hạn';
      } else if (this.exportItems[i].trangThai == '1') {
        trangThai = 'Sắp hết hạn';
      } else {
        trangThai = 'Đã hết hạn';
      }
      if (String(this.exportItems[i].gioiTinh) == 'true') {
        this.exportItems[i].gioiTinh = 'Nam';
      } else if (String(this.exportItems[i].gioiTinh) == 'false') {
        this.exportItems[i].gioiTinh = 'Nữ';
      } else {
        this.exportItems[i].gioiTinh = '';
      }
      worksheet.addRow({
        soTt: this.exportItems[i].stt,
        soHC: this.exportItems[i].soHC,
        hoTen: this.exportItems[i].hoTen,
        gioiTinh: this.exportItems[i].gioiTinh,
        cmndSo: this.exportItems[i].cmndSo == 'null' ? "" : this.exportItems[i].cmndSo,
        ngaySinh: this.exportItems[i].ngaySinh,
        chucVu: this.exportItems[i].chucVu == 'null' ? "" : this.exportItems[i].chucVu,
        coQuan: this.exportItems[i].coQuan == 'null' ? "" : this.exportItems[i].coQuan,
        loaiHC: this.exportItems[i].loaiHC,
        cmndNgayCap: this.exportItems[i].cmndNgayCap,
        cmndNgayHL: this.exportItems[i].cmndNgayHL,
        tGianHetHan: this.exportItems[i].tGianHetHan + ' Ngày',
        trangThai: trangThai
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
        for (let i = 0; i < totalEX + 2; i++) {
          worksheet.getCell('C' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('C' + [i]).alignment = {
            vertical: 'middle', horizontal: 'left', wrapText: true
          };

          worksheet.getCell('H' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('H' + [i]).alignment = {
            vertical: 'middle', horizontal: 'left', wrapText: true
          };

          worksheet.getCell('I' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('I' + [i]).alignment = {
            vertical: 'middle', horizontal: 'left', wrapText: true
          };

          worksheet.getCell('G' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('G' + [i]).alignment = {
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
          footerCell.value = 'Tổng số: ' + totalEX;
          footerCell.font = { color: { argb: 'black' }, italic: true, bold: true, name: 'Times New Roman' };
          footerCell.alignment = { horizontal: 'left' };
        }


      });
    });

    let fileName = "Danh_sách_hộ_chiếu_ngoại_giao_công_vụ.xlsx";
    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer()
      .then(function (buffer) {
        // done buffering
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(data, fileName);
      });
  }


  loadDataPrint(): void {
    this.isLoading = true;
    this.HChieuNGService.query().subscribe({
      next: (res: HttpResponse<HoChieuNgoaiGiao[]>) => {
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
  private onPrintSuccess(pitem: HoChieuNgoaiGiao[] | null, headers: HttpHeaders): void {
    for (let i = 0; i < pitem.length; i++) {

      let [day, month, year] = pitem[i].cmndNgayHL.split('/');
      const dateNgayHL = new Date(+year, +month - 1, +day);
      const dateHieuluc = new Date(+year, +month - 1, +day);
      dateHieuluc.setMonth(dateHieuluc.getMonth() - Number(this.checkNgayHL));
      const today = new Date();
      var hl = new Date(dateHieuluc.getFullYear(), dateHieuluc.getMonth(), dateHieuluc.getDate());
      var td = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const time = Math.floor(Date.UTC(dateNgayHL.getFullYear(), dateNgayHL.getMonth(), dateNgayHL.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      pitem[i].tGianHetHan = (time / (1000 * 3600 * 24)) + 1;
      if (hl.getTime() >= td.getTime()) {
        pitem[i].trangThai = '0';
      } else if (hl.getTime() < td.getTime() && pitem[i].tGianHetHan > 0) {
        pitem[i].trangThai = '1';
      } else if (pitem[i].tGianHetHan <= 0) {
        pitem[i].trangThai = '2';
      }
    }
    this.pitems = pitem;
  }

  transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
    if (Object.keys(filter).length == 0) return items;
    let filterKeys = Object.keys(filter);
    let dk = JSON.stringify(this.filter);
    return items.filter(item => {
      return filterKeys.every(keyName => {
        if (keyName === 'trangThai' && (filter[keyName] === null || filter[keyName] === 'null')) {
          filter[keyName] = '';
          delete this.filter[keyName];
          sessionStorage.setItem('dktk', dk);
          return true;
        }
        // console.log(keyName);
        sessionStorage.setItem('dktk', dk);
        return (
          new RegExp(filter[keyName], 'gi').test(item[keyName]) ||
          filter[keyName] === ''
        );
      });
    });
  }

  currentDate = new Date();
  print(): void {
    const cValue = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
    const printWindow = window.open('', 'PRINT');
    let dataString: string = "";
    let condition: string = "";
    var trangThai = "";
    var trangThaiPrint = "";
    if (this.fields.hoTen != undefined && this.fields.trangThai != undefined) {
      if (Number(this.fields.trangThai) == 0) {
        trangThai = 'Còn Hạn';
        condition += 'Trạng thái: ' + String(trangThai) + ' ';
      } else if (Number(this.fields.trangThai) == 1) {
        trangThai = 'Sắp hết hạn';
        condition += 'Trạng thái: ' + String(trangThai) + ' ';
      } else if (Number(this.fields.trangThai) == 2) {
        trangThai = 'Đã hết hạn';
        condition += 'Trạng thái: ' + String(trangThai) + ' ';
      }
    } else {
      if (this.fields.hoTen == undefined) {
        this.fields.hoTen = '';
      } else {
        condition += ' Họ tên: ' + String(this.fields.hoTen) + ' ';
      }
      if (this.fields.trangThai == undefined) {
        trangThai = '';
      } else if (Number(this.fields.trangThai) == 0) {
        trangThai = 'Còn Hạn';
        condition += 'Trạng thái: ' + String(trangThai) + ' ';
      } else if (Number(this.fields.trangThai) == 1) {
        trangThai = 'Sắp hết hạn';
        condition += 'Trạng thái: ' + String(trangThai) + ' ';
      } else if (Number(this.fields.trangThai) == 2) {
        trangThai = 'Đã hết hạn';
        condition += 'Trạng thái: ' + String(trangThai) + ' ';
      }
    }

    for (let i = 0; i < this.pitems.length; i++) {
      if (this.pitems[i].trangThai == '0') {
        trangThaiPrint = 'Còn hạn';
      } else if (this.pitems[i].trangThai == '1') {
        trangThaiPrint = 'Sắp hết hạn';
      } else {
        trangThaiPrint = 'Đã hết hạn';
      }
      if (String(this.pitems[i].gioiTinh) == 'true') {
        this.pitems[i].gioiTinh = 'Nam';
      } else if (String(this.pitems[i].gioiTinh) == 'false') {
        this.pitems[i].gioiTinh = 'Nữ';
      } else {
        this.pitems[i].gioiTinh = '';
      }


      dataString = dataString + '<tr>'
        + '<td class="text-center">' + (i + 1)
        + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center">' + this.pitems[i].soHC + '</td>'
        + '<td scope="col" class="data-text">' + this.pitems[i].hoTen + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center">' + this.pitems[i].gioiTinh + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center">' + (this.pitems[i].cmndSo == 'null' ? "" : this.pitems[i].cmndSo) + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center">' + (this.pitems[i].ngaySinh == null ? "" : this.pitems[i].ngaySinh) + '</td>'
        + '<td scope="col" class="data-text">' + (this.pitems[i].chucVu == 'null' ? "" : this.pitems[i].chucVu) + '</td>'
        + '<td scope="col" class="data-text">' + (this.pitems[i].coQuan == 'null' ? "" : this.pitems[i].coQuan) + '</td>'
        + '<td scope="col" class="data-text">' + (this.pitems[i].loaiHC == 'null' ? "" : this.pitems[i].loaiHC) + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center">' + (this.pitems[i].cmndNgayCap == null ? "" : this.pitems[i].cmndNgayCap) + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center">' + (this.pitems[i].cmndNgayHL == null ? "" : this.pitems[i].cmndNgayHL) + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center">' + (this.pitems[i].tGianHetHan == null ? "" : this.pitems[i].tGianHetHan) + ' Ngày' + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center">' + (trangThaiPrint == null ? "" : trangThaiPrint) + '</td>'
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
    <body><div style="background-color: white;" id="print">
        <div>
          <table style="background-color: white; class="table-space" border="0">
            <tr>
              <td  style="text-align: center;width: 26%;">
                <div class="title"><b>BAN ĐỐI NGOẠI TRUNG ƯƠNG ĐẢNG</b></div>
                <div class="title"><b>VỤ LỄ TÂN</b></div>
              </td>
              <td style="text-align: center;width: 74%;">
                <div class="title"></div>
              </td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center;">
                  <div class="title_head"><b>BÁO CÁO THỐNG KÊ HỘ CHIẾU</b></div>
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
    <div class="table-responsive">
      <table class="table table-striped" aria-describedby="user-management-page-heading" border="1">
        <thead>
          <tr >
            <th scope="col" class="text-center"><span>STT</span></th>
            <th scope="col" class="text-center"><span>Số hộ chiếu</span> </th>
            <th scope="col" class="text-center"><span>Họ và tên</span> </th>
            <th scope="col" class="text-center"><span>Giới tính</span></th>
            <th scope="col" class="text-center"><span>CCCD</span></th>
            <th scope="col" class="text-center"><span>Ngày sinh</span></th>
            <th scope="col" class="text-center"><span>Chức vụ</span></th>
            <th scope="col" class="text-center"><span>Cơ quan</span></th>        
            <th scope="col" class="text-center"><span>Loại hộ chiếu</span></th>
            <th scope="col" class="text-center"><span>Ngày cấp</span></th>
            <th scope="col" class="text-center"><span>Ngày hết hạn</span></th>           
            <th scope="col" class="text-center"><span>Thời gian còn lại</span></th>
            <th scope="col" class="text-center"><span>Trạng thái</span></th>
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
    <div class="title d-flex justify-content-end">
      <table style="background-color: white;"  class="table-space" border="0">
          <tr>
            <td  style="text-align: center; width: 83%;">
              <div class="title"></div>
            </td>
            <td style="text-align: center; width: 17%;">
              <div class="text-center"> <i>Ngày ${cValue.split('-')[2]} tháng ${cValue.split('-')[1]} năm ${cValue.split('-')[0]}</i></div>
            </td>
          </tr>
          <tr>
            <td style="text-align: center;">
              <div class="title"></div>
            </td>
            <td style="text-align: center;">
              <div class="text-center"><b>Người lập</b></div>
            </td>
          </tr>  
          <tr>
            <td  style="text-align: center;">
              <div class="title"></div>
            </td>
            <td style="text-align: center;">
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

  deleteCondition() {
    this.fields = {
      hoTen: "",
      cmndSo: "",
      soHC: "",
      trangThai: null,
    };

  }
}


