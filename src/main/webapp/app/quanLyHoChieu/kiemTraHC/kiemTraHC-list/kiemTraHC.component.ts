import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC } from 'app/config/navigation.constants';
import { KiemTraHCService } from '../service/kiemTraHC.service';
import { KiemTraHC } from '../kiemTraHC.model';
import { FormArray } from '@angular/forms';
import FileSaver from 'file-saver';
import Excel from "exceljs/dist/exceljs.min.js";
import { formatDate } from '@angular/common';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { THOI_GIAN_HIEU_LUC } from 'app/app.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { SessionStorageService } from 'ngx-webstorage';

export interface IFileUpload {
  RequestID: string;
  AttachmentName: string;
  AttachmentContent: any;
  FormType: string;
  AttachmentFlag: boolean;
}

@Component({
  selector: 'jhi-KiemTraHC-mgmt',
  templateUrl: './kiemTraHC.component.html',
  styleUrls: ['./kiemTraHC.component.scss']
})
export class KiemTraHCComponent implements OnInit {
  kiemTraHCs: KiemTraHC[] = [];

  //listSoHCLoi: KiemTraHC[] = [];

  listKT: FormArray;

  fileList: File;
  selectedFile = null;

  ConHan = 0;
  SapHetHan = 0;
  HetHan = 0;
  KhongTonTai = 0;

  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  nameModule = 'hộ chiếu';
  checkData = 0;
  totalPage = 0;
  FileName: string;
  currentPath: string;
  checkNgayHL: string = this.sessionStorageService.retrieve('ThoiHanHC');
  constructor(
    private KiemTraHCService: KiemTraHCService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alert: AlertServiceCheck,
    private NavbarService: NavBarService,
    private sessionStorageService: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.currentPath = this.router.url;
    this.NavbarService.getPath(this.currentPath)
  }
  success = false;
  kiemTra() {
    this.kiemTraHCs = [];
    this.checkData = 0;
    //this.listSoHCLoi = [];
    this.ConHan = 0;
    this.SapHetHan = 0;
    this.HetHan = 0;
    this.KhongTonTai = 0;
    if (this.fileList == null || String(this.fileList) == '') {
      this.alert.warn('Bạn chưa chọn danh sách hộ chiếu muốn kiểm tra!');
      //alert('Bạn chưa chọn danh sách hộ chiếu muốn kiểm tra!');
      //this.toast.addAlert({ message: 'Thêm file để kiểm tra', type: 'danger', toast: true })
    }
    // else if(String(this.FileName.slice(0,17)) != 'KiemTraHCTemplate') {
    //   alert('Chọn tải mẫu File danh sách hộ chiếu KiemTraHCTemplate.xlsx để kiểm tra!');
    // } 
    else {
      const formData = new FormData();
      formData.append('file', this.fileList);
      console.log(this.fileList);
      this.KiemTraHCService.kiemtra(formData).subscribe({
        next: (data) => {
          const page = 0;
          this.page = +(page ?? 1);
          this.onSuccess(data.body)
        },
        error: response => this.processError(response)
      }
        //   (data) => {
        //   const page = 0;
        //   this.page = +(page ?? 1);
        //   this.onSuccess(data);
        // }
      );
    }
  }
  private processError(response: HttpErrorResponse) {
    if (String(response.error.text) == 'Template invalid') {
      this.alert.error('Mẫu file tải lên không đúng định dạng. Nhấn tải mẫu file!');
    }
  }



  private onSuccess(data): void {
    this.totalItems = data.length;

    for (let i = 0; i < data.length; i++) {
      if (i != 0) {
        data[0].stt = 1;
        data[i].stt = data[i - 1].stt + 1;
      }
      if (data[i].idLoaiHC == '' || data[i].idLoaiHC == null) {
        console.log('Không tồn số hộ chiếu ' + data[i].soHC);
        //this.listSoHCLoi.push(data[i]);
        data[i].tGianHL = -9999;
        data[i].trangThai = '3';
        this.KhongTonTai++;
      } else {

        let [day, month, year] = data[i].cmndNgayHL.split('/');
        const dateNgayHL = new Date(+year, +month - 1, +day);
        const dateHieuluc = new Date(+year, +month - 1, +day);
        dateHieuluc.setMonth(dateHieuluc.getMonth() - Number(this.checkNgayHL));
        const today = new Date();
        var hl = new Date(dateHieuluc.getFullYear(), dateHieuluc.getMonth(), dateHieuluc.getDate());
        var td = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const time = Math.floor(Date.UTC(dateNgayHL.getFullYear(), dateNgayHL.getMonth(), dateNgayHL.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        data[i].tGianHL = (time / (1000 * 3600 * 24)) + 1;
        if (hl.getTime() >= td.getTime()) {
          data[i].trangThai = '0';
          this.ConHan++;
        } else if (hl.getTime() < td.getTime() && data[i].tGianHL > 0) {
          data[i].trangThai = '1';
          this.SapHetHan++;
        } else if (data[i].tGianHL <= 0 && data[i].tGianHL != -9999) {
          data[i].trangThai = '2';
          this.HetHan++
        }



        // let [day, month, year] = data[i].cmndNgayHL.split('/');
        // const dateNgayHL = new Date(+year, +month - 1, +day);
        // const today = new Date();
        // const time = Math.floor(Date.UTC(dateNgayHL.getFullYear(), dateNgayHL.getMonth(), dateNgayHL.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
        // data[i].tGianHL = time / (1000 * 3600 * 24);
        // if (data[i].tGianHL >= THOI_GIAN_HIEU_LUC) {
        //   data[i].trangThai = '0';
        //   this.ConHan++;
        // } else if (data[i].tGianHL < THOI_GIAN_HIEU_LUC && data[i].tGianHL > 0) {
        //   data[i].trangThai = '1';
        //   this.SapHetHan++;
        // } else if (data[i].tGianHL <= 0 && data[i].tGianHL != -9999) {
        //   data[i].trangThai = '2';
        //   this.HetHan++;
        // }


        if (String(data[i].gioiTinh) == 'true') {
          data[i].gioiTinh = 'Nam';
        } else if (String(data[i].gioiTinh) == 'null') {
          data[i].gioiTinh = '';
        } else {
          data[i].gioiTinh = 'Nữ';
        }
      }
      if (data[i].tGianHL == -9999) {
        data[i].tGianHL = '';
      } else {
        data[i].tGianHL = String(data[i].tGianHL) + ' Ngày';
      }
      this.kiemTraHCs.push(data[i]);
    }
    this.checkData = 1;
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
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


  handleFileInput = async (event) => {
    this.selectedFile = event.target.files;
    this.fileList = this.selectedFile[0];
    this.FileName = this.selectedFile[0].name;
    console.log(this.FileName.slice(0, 17));
  }

  checkExport() {
    if (this.fileList == null || String(this.fileList) == '') {
      this.alert.warn('Bạn chưa chọn danh sách hộ chiếu muốn kiểm tra!');
      //this.toast.addAlert({ message: 'Thêm file để kiểm tra', type: 'danger', toast: true })
    }
    // else if(String(this.FileName.slice(0,17)) != 'KiemTraHCTemplate') {
    //   alert('Chọn tải mẫu File danh sách hộ chiếu KiemTraHCTemplate.xlsx để kiểm tra!');
    // } 
    else {
      this.export();
    }
  }



  export() {
    let totalEX = this.kiemTraHCs.length;
    for (let i = 0; i < this.kiemTraHCs.length; i++) {
      if (String(this.kiemTraHCs[i].trangThai) == '0') {
        this.kiemTraHCs[i].trangThaiEx = 'Còn hạn';
      } else if (String(this.kiemTraHCs[i].trangThai) == '1') {
        this.kiemTraHCs[i].trangThaiEx = 'Sắp hết hạn';
      } else if (String(this.kiemTraHCs[i].trangThai) == '2') {
        this.kiemTraHCs[i].trangThaiEx = 'Đã hết hạn';
      } else if (String(this.kiemTraHCs[i].trangThai) == '3') {
        this.kiemTraHCs[i].trangThaiEx = 'Không tồn tại';
      }
    }


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

    for (let i = 0; i < this.kiemTraHCs.length; i++) {
      worksheet.addRow({
        soTt: this.kiemTraHCs[i].stt,
        soHC: this.kiemTraHCs[i].soHC,
        hoTen: this.kiemTraHCs[i].hoTen,
        gioiTinh: this.kiemTraHCs[i].gioiTinh,
        cmndSo: this.kiemTraHCs[i].cmndSo == 'null' ? "" : this.kiemTraHCs[i].cmndSo,
        ngaySinh: this.kiemTraHCs[i].ngaySinh,
        chucVu: this.kiemTraHCs[i].chucVu == 'null' ? "" : this.kiemTraHCs[i].chucVu,
        coQuan: this.kiemTraHCs[i].coQuan == 'null' ? "" : this.kiemTraHCs[i].coQuan,
        loaiHC: this.kiemTraHCs[i].loaiHC,
        cmndNgayCap: this.kiemTraHCs[i].cmndNgayCap,
        cmndNgayHL: this.kiemTraHCs[i].cmndNgayHL,
        tGianHetHan: this.kiemTraHCs[i].tGianHL,
        trangThai: this.kiemTraHCs[i].trangThaiEx
      });
    }

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
          worksheet.getCell('G' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('G' + [i]).alignment = {
            vertical: 'middle', horizontal: 'left', wrapText: true
          };

          worksheet.getCell('C' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('C' + [i]).alignment = {
            vertical: 'middle', horizontal: 'left', wrapText: true
          };

          worksheet.getCell('I' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('I' + [i]).alignment = {
            vertical: 'middle', horizontal: 'left', wrapText: true
          };

          worksheet.getCell('H' + [1]).alignment = {
            vertical: 'middle', horizontal: 'center', wrapText: true
          };
          worksheet.getCell('H' + [i]).alignment = {
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
          footerCell.font = { color: { argb: 'black' }, italic: true, bold: true, name: 'Times New Roman', };
          footerCell.alignment = { horizontal: 'left' };
        }
      });
    });

    let fileName = "DanhSáchHộChiếuKiểmTra.xlsx";
    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer()
      .then(function (buffer) {
        // done buffering
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(data, fileName);
      });
  }


  checkPrint() {
    if (this.fileList == null || String(this.fileList) == '') {
      this.alert.warn('Bạn chưa chọn danh sách hộ chiếu muốn kiểm tra!');
      //this.toast.addAlert({ message: 'Thêm file để kiểm tra', type: 'danger', toast: true })
    }
    // else if(String(this.FileName.slice(0,17)) != 'KiemTraHCTemplate') {
    //   alert('Chọn tải mẫu File danh sách hộ chiếu KiemTraHCTemplate.xlsx để kiểm tra!');
    // } 
    else {
      this.print();
    }
  }

  currentDate = new Date();
  print(): void {
    const cValue = formatDate(this.currentDate, 'yyyy-MM-dd', 'en-US');
    const printWindow = window.open('', 'PRINT');
    let dataString: string = "";

    for (let i = 0; i < this.kiemTraHCs.length; i++) {
      if (this.kiemTraHCs[i].trangThai == '0') {
        this.kiemTraHCs[i].trangThaiEx = 'Còn hạn';
      } else if (this.kiemTraHCs[i].trangThai == '1') {
        this.kiemTraHCs[i].trangThaiEx = 'Sắp hết hạn';
      } else if (this.kiemTraHCs[i].trangThai == '2') {
        this.kiemTraHCs[i].trangThaiEx = 'Đã hết hạn';
      } else {
        this.kiemTraHCs[i].trangThaiEx = 'Không tồn tại';
      }
    }
    for (let i = 0; i < this.kiemTraHCs.length; i++) {
      dataString = dataString + '<tr>'
        + '<td class="text-center">' + (i + 1) + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center; width: 50px;">' + this.kiemTraHCs[i].soHC + '</td>'
        + '<td scope="col" class="data-text" style="width: 115px;">' + (String(this.kiemTraHCs[i].hoTen) == 'null' ? "" : this.kiemTraHCs[i].hoTen) + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center">' + (String(this.kiemTraHCs[i].gioiTinh) == 'null' ? "" : this.kiemTraHCs[i].gioiTinh) + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center">' + (String(this.kiemTraHCs[i].cmndSo) == 'null' ? "" : this.kiemTraHCs[i].cmndSo) + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center">' + (String(this.kiemTraHCs[i].ngaySinh) == 'null' ? "" : this.kiemTraHCs[i].ngaySinh) + '</td>'
        + '<td scope="col" class="data-text" style="width: 70px;">' + (String(this.kiemTraHCs[i].chucVu) == 'null' ? "" : this.kiemTraHCs[i].chucVu) + '</td>'
        + '<td scope="col" class="data-text" style="width: 80px;">' + (String(this.kiemTraHCs[i].coQuan) == 'null' ? "" : this.kiemTraHCs[i].coQuan) + '</td>'
        + '<td scope="col" class="data-text" style="width: 115px;">' + (String(this.kiemTraHCs[i].loaiHC) == 'null' ? "" : this.kiemTraHCs[i].loaiHC) + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center">' + (String(this.kiemTraHCs[i].cmndNgayCap) == 'null' ? "" : this.kiemTraHCs[i].cmndNgayCap) + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center">' + (String(this.kiemTraHCs[i].cmndNgayHL) == 'null' ? "" : this.kiemTraHCs[i].cmndNgayHL) + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center; width: 70px;">' + (this.kiemTraHCs[i].tGianHL == null ? "" : this.kiemTraHCs[i].tGianHL) + '</td>'
        + '<td scope="col" class="data-text" style="text-align:center; width: 90px;">' + (this.kiemTraHCs[i].trangThaiEx == 'null' ? "" : this.kiemTraHCs[i].trangThaiEx) + '</td>'
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
                  <div class="title_head"><b>KẾT QUẢ KIỂM TRA HỘ CHIẾU THEO DANH SÁCH</b></div>
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
            <th scope="col" class="text-center"><span>Số hộ chiếu</span></th>
            <th scope="col" class="text-center"><span>Họ và tên</span></th>
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
        <b><i>Tổng số : ${this.kiemTraHCs.length}</i></b>
    </div>
    <br>
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

  downloadFile() {
    var options = {
      useStyles: true,
      useSharedStrings: true
    };
    let workbook = new Excel.Workbook(options);
    var worksheet = workbook.addWorksheet('My Sheet', { properties: { tabColor: { argb: 'FFC0000' } } });
    worksheet.columns = [
      { header: 'Số hộ chiếu', key: 'soHC', width: 20 },
    ]
    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
      row.eachCell(function (cell) {
        cell.font = {
          name: 'Times New Roman',
          family: 2,
          bold: false,
          size: 10,
        };
        cell.alignment = {
          vertical: 'middle', horizontal: 'center'
        };
        for (var i = 1; i < 2; i++) {
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
        }
      });
    });

    let fileName = "KiemTraHCTemplate.xlsx";
    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer()
      .then(function (buffer) {
        // done buffering
        const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(data, fileName);
      });
  }

}
