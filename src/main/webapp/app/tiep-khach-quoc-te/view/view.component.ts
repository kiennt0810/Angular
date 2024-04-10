import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TKQTThongTinVM } from '../TKQTThongTinVM.model';
import { TiepkhachquocteService } from '../service/tiepkhachquoctet.service';
import { FileUploadVM } from '../file.model';
import * as fileSaver from 'file-saver';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

@Component({
  selector: 'jhi-view',
  templateUrl: './view.component.html',
  styleUrls: ['../../income.component.scss', './view.component.scss']
})
export class ViewComponent implements OnInit {
  TkForm: TKQTThongTinVM | null = null;
  listFile: FileUploadVM | null = null;
  totalKhach = 0;
  totalTV = 0;
  downloads = [];
  currentPath: string;
  checkKhach = false;
  checkVN = false;
  constructor(
    private Service: TiepkhachquocteService,
    private route: ActivatedRoute,
    private navbarService: NavBarService,
    private router: Router,) {
  }
  ngOnInit(): void {
    this.checkKhach = false;
    this.checkVN = false;
    const id = this.route.snapshot.params.id;
    this.Service.getCurrentData(id).subscribe((result) => {
      this.TkForm = result;
      this.listFile = result.listDVFileVM;
      this.totalKhach = result.listTKQTKhachVM.length;

      if (String(this.TkForm.chucVu) == 'null') {
        this.TkForm.chucVu = '';
      }

      for (let i = 0; i < result.listTKQTKhachVM.length; i++) {
        if (String(result.listTKQTKhachVM[i].gioiTinh) == 'true') {
          result.listTKQTKhachVM[i].gioiTinh = 'Nam';
        } else if (String(result.listTKQTKhachVM[i].gioiTinh) == 'false') {
          result.listTKQTKhachVM[i].gioiTinh = 'Nữ';
        } else {
          result.listTKQTKhachVM[i].gioiTinh = '';
        }
        if (String(result.listTKQTKhachVM[i].hoTen) == '' && String(result.listTKQTKhachVM[i].gioiTinh) == ''
          && String(result.listTKQTKhachVM[i].ngaySinh) == '' && String(result.listTKQTKhachVM[i].chucVu) == ''
          && String(result.listTKQTKhachVM[i].coQuan) == '' && result.listTKQTKhachVM.length == 1) {
          this.totalKhach = 0;
          this.checkKhach = true;
        }
      }
      this.totalTV = result.listTKQTThanhVienVM.length;
      for (let i = 0; i < result.listTKQTThanhVienVM.length; i++) {
        if (String(result.listTKQTThanhVienVM[i].gioiTinh) == 'true') {
          result.listTKQTThanhVienVM[i].gioiTinh = 'Nam';
        } else if (String(result.listTKQTThanhVienVM[i].gioiTinh) == 'false') {
          result.listTKQTThanhVienVM[i].gioiTinh = 'Nữ';
        } else {
          result.listTKQTThanhVienVM[i].gioiTinh = '';
        }
        if (String(result.listTKQTThanhVienVM[i].hoTen) == '' && String(result.listTKQTThanhVienVM[i].gioiTinh) == ''
          && String(result.listTKQTThanhVienVM[i].ngaySinh) == '' && String(result.listTKQTThanhVienVM[i].chucVu) == ''
          && String(result.listTKQTThanhVienVM[i].coQuan) == '' && result.listTKQTThanhVienVM.length == 1) {
          this.totalTV = 0;
          this.checkVN = true;
        }
      }
    });
    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Xem')
  }

  downloadFile(id: number, name: string) {
    this.Service.downloadFile(id).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/json; charset=utf-8' });
      // const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, name);
    }), (error: any) => console.log('Error downloading the file');
  }

  previousState(): void {
    window.history.back();
  }


  print(): void {
    const printWindow = window.open('', 'PRINT');
    let dataStringKhach: string = "";
    let dataStringCN: string = "";
    let dataStringFile: string = "";
    for (let i = 0; i < this.TkForm.listTKQTKhachVM.length; i++) {
      if (String(this.TkForm.listTKQTKhachVM[i].hoTen) == '' && String(this.TkForm.listTKQTKhachVM[i].gioiTinh) == ''
        && String(this.TkForm.listTKQTKhachVM[i].ngaySinh) == '' && String(this.TkForm.listTKQTKhachVM[i].chucVu) == ''
        && String(this.TkForm.listTKQTKhachVM[i].coQuan) == '' && this.TkForm.listTKQTKhachVM.length == 1) {
        this.totalKhach = 0;
        this.checkKhach = true;
        dataStringKhach = "";
      } else {
        dataStringKhach = dataStringKhach + '<tr>'
          + '<td class="text-center">' + (i + 1) + '</td>'
          + '<td class="data-text">' + this.TkForm.listTKQTKhachVM[i].hoTen + '</td>'
          + '<td class="text-center">' + this.TkForm.listTKQTKhachVM[i].gioiTinh + '</td>'
          + '<td class="text-center">' + this.TkForm.listTKQTKhachVM[i].ngaySinh + '</td>'
          + '<td  class="data-text">' + this.TkForm.listTKQTKhachVM[i].chucVu + '</td>'
          + '<td class="data-text">' + (this.TkForm.listTKQTKhachVM[i].coQuan == 'null' ? "" : this.TkForm.listTKQTKhachVM[i].coQuan) + '</td>'
        '</tr>';
      }
    }

    for (let i = 0; i < this.TkForm.listTKQTThanhVienVM.length; i++) {
      if (String(this.TkForm.listTKQTThanhVienVM[i].hoTen) == '' && String(this.TkForm.listTKQTThanhVienVM[i].gioiTinh) == ''
        && String(this.TkForm.listTKQTThanhVienVM[i].ngaySinh) == '' && String(this.TkForm.listTKQTThanhVienVM[i].chucVu) == ''
        && String(this.TkForm.listTKQTThanhVienVM[i].coQuan) == '' && this.TkForm.listTKQTThanhVienVM.length == 1) {
        this.totalTV = 0;
        this.checkVN = true;
        dataStringCN = "";
      } else {
        dataStringCN = dataStringCN + '<tr>'
          + '<td class="text-center">' + (i + 1)
          + '</td>'
          + '<td class="data-text">' + this.TkForm.listTKQTThanhVienVM[i].hoTen + '</td>'
          + '<td class="text-center">' + this.TkForm.listTKQTThanhVienVM[i].gioiTinh + '</td>'
          + '<td class="text-center">' + this.TkForm.listTKQTThanhVienVM[i].ngaySinh + '</td>'
          + '<td  class="data-text">' + this.TkForm.listTKQTThanhVienVM[i].chucVu + '</td>'
          + '<td class="data-text">' + (this.TkForm.listTKQTThanhVienVM[i].coQuan == null ? "" : this.TkForm.listTKQTThanhVienVM[i].coQuan) + '</td>'
        '</tr>';
      }
    }

    for (let i = 0; i < this.TkForm.listTKQTFileVM.length; i++) {
      dataStringFile = dataStringFile + '<tr>'
        + '<td class="text-center">' + (i + 1)
        + '</td>'
        + '<td class="data-text">' + this.TkForm.listTKQTFileVM[i].fileName + '</td>'
      '</tr>';
    }
    printWindow.document.write(`<html><head><style>
        <link rel="stylesheet" href="bootstrap-icons/font/bootstrap-icons.css">
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
        table {
          border-collapse: collapse;
        }
        .text-center {
          font-family: Tahoma, Verdana, Arial, Helvetica, sans-serif;
          color: #000000;
          font-size: 9pt;
          text-align:center;
        }

        .text-right {
          font-family: Tahoma, Verdana, Arial, Helvetica, sans-serif;
          color: #000000;
          font-size: 9pt;
          text-align:right;
        }
        .form-control{
          width:100%;
          border-radius :5px;
        }
        .table-space tr td{
          vertical-align: middle;
        }
        .table-space tr{
          height :35px;
        }
        h5{
          display:inherit;
        }
        input[type=text] {
          padding:5px; 
          border:1px solid; 
          -webkit-border-radius: 5px;
          border-radius: 5px;
      }
      
      input[type=text]:focus {
          border-color:#333;
      }
      </style>
      </head>
      <body><div style="background-color: white;" id="print" style="width:794px" class="data-text">
      <div>
          <div>
            <table class="table-space" border="0" style="width:794px">
    
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Lãnh đạo tiếp khách</h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control" readonly type="text" value="${this.TkForm.lanhDao}"></div>
                </td>
                
              </tr>
              <tr>
                  
                  <td [style.width.%]="20">
                    <h5 >Chức vụ</h5>
                  </td>
                  <td colspan="4">
                    <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${this.TkForm.chucVu}"></div>
                  </td>
                  
                </tr>
                <tr>
                  
                  <td [style.width.%]="20">
                    <h5 >Cơ quan </h5>
                  </td>
                  <td colspan="4">
                    <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${this.TkForm.coQuan}"></div>
                  </td>
                  
                </tr>
                <tr>
                  
                  <td [style.width.%]="20">
                    <h5 >Tên đoàn khách </h5>
                  </td>
                  <td colspan="4">
                    <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${this.TkForm.doanKhach}"></div>
                  </td>
                  
                </tr>
                <tr>
                  
                  <td [style.width.%]="20">
                    <h5 >Quốc gia </h5>
                  </td>
                  <td colspan="4">
                    <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${this.TkForm.quocGia}"></div>
                  </td>
                  
                </tr>
                <tr>
                  
                  <td [style.width.%]="20">
                    <h5 >Thời gian tiếp khách</h5>
                  </td>
                  <td [style.width.%]="15">
                      <h5 class="text-center">Từ ngày</h5>
                    </td>
                  <td [style.width.%]="25">
                      <div class="input-group">
                          <input class="form-control disableDiv" readonly type="text" placeholder="dd/mm/yyyy" value="${this.TkForm.thoiGianTu}"/>
                      </div>
                  </td>
                  <td [style.width.%]="15">
                      <h5 class="text-center" style="padding-left:20px">Đến ngày</h5>
                    </td>
                  <td [style.width.%]="25"><div class="input-group">
                           <input class="form-control disableDiv" readonly type="text" placeholder="dd/mm/yyyy" value="${this.TkForm.thoiGianDen}"/>
                      </div>
                  </td>
                  
                </tr>
                <tr>
                  
                  <td [style.width.%]="20">
                    <h5 >Địa điểm</h5>
                  </td>
                  <td colspan="4">
                    <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${this.TkForm.diaDiem}"></div>
                  </td>
                  
                </tr>
                <tr>
                 
                  <td [style.width.%]="20">
                    <h5 >Hình thức tiếp khách</h5>
                  </td>
                  <td colspan="4">
                    <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${this.TkForm.hinhThuc}"></div>
                  </td>
                 
                </tr>
                
            </table>
            </div>
            <br/>
            <div>
              <table border="0" style="width:794px">
                  <tr>
                      
                      <td >
                          <div> <h5 style="font-weight: bold;height:5px">Danh sách thành viên của đoàn khách </h5></div>
                      </td>
                      
                     </tr>
                      <tr>
                      
                      <td>
                      <div class="table-responsive" style="width:794px">
                      <table class="table table-striped" aria-describedby="user-management-page-heading" style="width:100%" border="1">
                            <thead>
                              <tr>
                                <th scope="col" class="text-center" style="width: 5%"><span>STT</span></th>
                                <th scope="col" class="text-center" style="width: 25%"><span>Họ và tên</span></th>
                                <th scope="col" class="text-center" style="width: 10%"><span>Giới tính</span></th>
                                <th scope="col" class="text-center" style="width: 10%"><span>Ngày sinh</span></th>
                                <th scope="col" class="text-center" style="width: 20%"><span>Chức vụ</span></th>
                                <th scope="col" class="text-center" style="width: 30%"><span>Cơ quan</span></th>
                              </tr>
                            </thead>
                            <tbody >
                            ${dataStringKhach}
                            </tbody>
                          </table>
                      </div>
                                   
                      </td>
                     
                  </tr>
                  <tr >
                    
                    <td style="text-align:right;height:20px"> <div class="text-right">Tổng số thành viên của đoàn khách : ${this.totalKhach}</div></td>
                   
                  </tr>
                  <tr >
                    <td></td>
                  </tr>
                  <tr style="height:30px">
                    
                    <td [style.width.%]="96">
                        <div> <h5 style="font-weight: bold;height:5px">Danh sách thành viên phía Việt Nam </h5></div>
                    </td>
                    
                   </tr>
                    <tr>
                    
                    <td>
                        <div class="table-responsive">
                        <table class="table table-striped" aria-describedby="user-management-page-heading" style="width:100%"  border="1">
                          <thead>
                            <tr>
                              <th scope="col" class="text-center" style="width: 5%"><span>STT</span> </th>
                              <th scope="col" class="text-center" style="width: 25%"><span>Họ và tên</span> </th>
                              <th scope="col" class="text-center" style="width: 10%"><span>Giới tính</span></th>
                              <th scope="col" class="text-center" style="width: 10%"><span>Ngày sinh</span></th>
                              <th scope="col" class="text-center" style="width: 20%"><span>Chức vụ</span></th>
                              <th scope="col" class="text-center" style="width: 30%"><span>Cơ quan</span></th>
                            </tr>
                          </thead>
                          <tbody >
                          ${dataStringCN}
                          </tbody>
                        </table>
                      </div>
                                 
                    </td>
                    
                </tr>
                <tr >
          
                  <td style="text-align:right;height:20px"> <div class="text-right">Tổng số thành viên phía Việt Nam : ${this.totalTV}</div></td>

                </tr>
                <tr >
                  <td></td>
                </tr>
                <tr>
                  
                  <td [style.width.%]="90">
                      <div> <h5 style="font-weight: bold;height:5px">Hồ sơ đính kèm</h5></div>
                  </td>
                  
                 </tr>
                <tr>
                  
                  <td [style.width.%]="96"> 
                  <div class="table-responsive" style="width:794px">
                  <table class="table table-striped" aria-describedby="user-management-page-heading" style="width:794px"  border="1">
                        <thead>
                          <tr>
                            <th scope="col" class="text-center" [style.width.%]="5"><span>STT</span> </th>
                            <th scope="col" class="text-center" [style.width.%]="95"><span>Tên file</span> </th>                         
                          </tr>
                        </thead>
                        <tbody >
                          ${dataStringFile}
                        </tbody>            
                      </table>
                    </div>
                               
                  </td>
                  
              </tr>
            </table></div>

      </div>
      <br>
    </div>
      </body></html>`)
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

}