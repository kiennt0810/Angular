import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { FileUploadVM } from '../../file.model';
import fileSaver from 'file-saver';
import { QuanLyTVService } from '../service/quanLyTVRa.service';
import { QuanLyTV } from '../quanLyTVRa.model';
import { DomSanitizer } from '@angular/platform-browser';
import { QGiaDen } from '../qGiaDen.model';
import { DoanRaService } from 'app/quanLyDoan/quanLyDoanRa/service/delegation-out.service';
import { HChieuNGService } from 'app/quanLyHoChieu/quanlyHCNgoaiGiao/service/hoCNgoaiGiao.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

@Component({
  selector: 'jhi-user-mgmt-detail',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class QuanLyTvRaViewComponent implements OnInit {
  quanLyTV: QuanLyTV | null = null;
  listFile: FileUploadVM | null = null;
  downloads= [];
  qGiaDen: any;
  qGiaDoan: QGiaDen[] | null = null;
  maDoan:any;
  gioiTinh: any;
  imagePrint:any;
  idAnh: number;
  nguoiLap: string;
  nguoiSua: string;
  currentPath: string;
  constructor(private Service: QuanLyTVService, private route: ActivatedRoute, private fb: FormBuilder, private router: Router,
    private sanitizer:DomSanitizer, private doanRaService: DoanRaService, private hChieuService: HChieuNGService,private navbarService: NavBarService) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.params.maTV);
    const id = this.route.snapshot.params.maTV;
    this.Service.getCurrentData(id).subscribe((result) => {
      this.quanLyTV = result;
      this.listFile = result.listTVFileVM;
      if (this.quanLyTV.createdBy) {
        this.nguoiLap = this.quanLyTV.createdBy;
      }
      if (this.quanLyTV.updatedBy) {
        this.nguoiSua = this.quanLyTV.updatedBy;
      }
      let HCNgoaiGiao = this.quanLyTV.hcNgoaiGiaoVM
      this.maDoan = result.maHSDoan;
      this.doanRaService.getQuocGia(this.maDoan).subscribe((qGia) => {
        this.qGiaDoan = qGia;
        for(let qGiaD of this.qGiaDoan)
          this.qGiaDen = this.qGiaDen == null ? qGiaD.quocGia : this.qGiaDen + ', ' + qGiaD.quocGia;
      });
      if(this.quanLyTV.idAnhHC != null) {
        this.idAnh = this.quanLyTV.idAnhHC ;
        this.downloadImg(this.quanLyTV.idAnhHC );
      }
      if (String(this.quanLyTV.hcNgoaiGiaoVM.coQuan) == 'null') {
        this.quanLyTV.hcNgoaiGiaoVM.coQuan = '';
      }
    });
    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Xem');
  }

  downloadFile(id: number, name: string) {
    this.Service.downloadFile(id).subscribe((response: any) => {
      let blob:any = new Blob([response], { type: 'application/json; charset=utf-8' });
      // const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, name);
    }), (error: any) => console.log('Error downloading the file');
  }

  downloadFileIMGHC(id: number, name: string) {
    this.Service.downloadFileIMG(id).subscribe((response: any) => {
      let blob:any = new Blob([response], { type: 'application/json; charset=utf-8' });
      // const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, name);
    }), (error: any) => console.log('Error downloading the file');
  }

  previousState(): void {
    window.history.back();
  }
  imageUrl: any;
  downloadImg(id: number) {
    this.hChieuService.downloadFile(id).subscribe((data: Blob) => {
      let objectURL = URL.createObjectURL(data);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.imagePrint = URL.createObjectURL(data);
    }), (error: any) => console.log('Error downloading the file');
  }

  print():void{ 
    const printWindow = window.open('','PRINT');
    let dataStringHoSo: string ="";
    let dataStringLdtd: string = "";
    let dataStringHddp: string = "";
    let dataStringAnNinh: string = "";
    if(this.quanLyTV.gioiTinh == null) {
      this.gioiTinh = ""
    } else if(this.quanLyTV.gioiTinh == true) {
      this.gioiTinh = "Nam"
    } else {
      this.gioiTinh = "Nữ"
    }
    for(let i=0;i<this.quanLyTV.listTVFileVM.length;i++){
      dataStringHoSo = dataStringHoSo + '<tr>' 
      +'<td class="text-center">'+ (i+1)
      +'</td>'
      +'<td class="data-text">'+ this.quanLyTV.listTVFileVM[i].fileName +'</td>'
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
                <h5 >STT trong đoàn</h5>
              </td>
              <td colspan="4">
                <div class="col d-flex justify-content-start"><input class="form-control" readonly type="text" value="${ this.quanLyTV.soTT}"></div>
              </td>
              <td rowspan="4">
                <div class="row text-center" style=" background-color: white;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); margin-left: 4%; border-radius: 4%;">
                    <img src="${this.imagePrint}" style="max-width: 100%; height: 135px;">
                </div>
              </td>
              
            </tr>
            <tr>
                
                <td [style.width.%]="20">
                  <h5 >Họ tên </h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.quanLyTV.hcNgoaiGiaoVM.hoTen}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="15">
                    <h5>Giới tính</h5>
                  </td>
                <td [style.width.%]="25">
                    <div class="input-group">
                        <input class="form-control disableDiv" readonly type="text"  value="${this.gioiTinh}"/>
                    </div>
                </td>
                <td style="width: 100px; padding-left: 3%;">
                    <h5 style="padding-left:1px;width:71px;">Ngày sinh</h5>
                  </td>
                <td  style="width: 130px"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.hcNgoaiGiaoVM.ngaySinh}"/>
                    </div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Chức vụ </h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.quanLyTV.hcNgoaiGiaoVM.chucVu == 'null' ? "" : this.quanLyTV.hcNgoaiGiaoVM.chucVu}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td style="width: 130px">
                  <h5 >Cơ quan làm việc</h5>
                </td>
                <td colspan="5">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.quanLyTV.hcNgoaiGiaoVM.coQuan == 'null' ? "" : this.quanLyTV.hcNgoaiGiaoVM.coQuan}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="15">
                    <h5>Số hộ chiếu</h5>
                  </td>
                <td [style.width.%]="25">
                    <div class="input-group">
                        <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.hcNgoaiGiaoVM.soHC}"/>
                    </div>
                </td>
                <td [style.width.%]="15" style="padding-left: 3%;">
                    <h5 style="padding-left:4px">Ngày cấp</h5>
                  </td>
                <td [style.width.%]="25"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.hcNgoaiGiaoVM.cmndNgayCap}"/>
                    </div>
                </td>
                <td [style.width.%]="15">
                    <h5 style="padding-left:11px">Ngày hết hạn</h5>
                  </td>
                <td [style.width.%]="25"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.hcNgoaiGiaoVM.cmndNgayHL}"/>
                    </div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Loại hộ chiếu </h5>
                </td>
                <td colspan="5">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.quanLyTV.hcNgoaiGiaoVM.loaiHC}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="15">
                    <h5>Số thị thực</h5>
                  </td>
                <td [style.width.%]="25">
                    <div class="input-group">
                        <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.soThiThuc  == undefined ? "" : this.quanLyTV.soThiThuc}"/>
                    </div>
                </td>
                <td [style.width.%]="15"></td>
                <td [style.width.%]="25"></td>
                <td style="width: 140px">
                    <h5 style="padding-left:11px">Ngày cấp thị thực</h5>
                  </td>
                <td [style.width.%]="25"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text" value="${this.quanLyTV.ngayCapTT == undefined ? "" : this.quanLyTV.ngayCapTT}"/>
                    </div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Quốc gia đến </h5>
                </td>
                <td colspan="5">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.quanLyTV.quocGia}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Nơi lưu trú </h5>
                </td>
                <td colspan="5">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.quanLyTV.noiLuuTru}"></div>
                </td>
                
              </tr>
              <tr>
              <td [style.width.%]="15">
                    <h5>Ngày xuất cảnh</h5>
                  </td>
                <td [style.width.%]="25"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.ngayXC}"/>
                    </div>
                </td>
                <td [style.width.%]="15"></td>
                <td [style.width.%]="25"></td>
                <td [style.width.%]="15">
                    <h5 style="padding-left:11px">Ngày nhập cảnh</h5>
                  </td>
                <td [style.width.%]="25">
                    <div class="input-group">
                        <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.ngayNC}"/>
                    </div>
                </td>
              </tr>
              <tr>
               
                <td [style.width.%]="20">
                  <h5 >Tặng phẩm</h5>
                </td>
                <td colspan="5">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${this.quanLyTV.tangPham}"></div>
                </td>
               
              </tr>
              
          </table>
          </div>
          <br/>
          <div>
            <table border="0" style="width:794px">
                <tr>
                    
                    <td >
                        <div> <h5 style="font-weight: bold;height:5px">Hồ sơ đính kèm </h5></div>
                    </td>
                    
                   </tr>
                    <tr>
                    
                    <td>
                    <div class="table-responsive" style="width:794px">
                    <table class="table table-striped" aria-describedby="user-management-page-heading" style="width:100%" border="1">
                          <thead>
                            <tr>
                              <th scope="col" class="text-center" style="width:10%;"><span>STT</span> </th>
                              <th scope="col" class="text-center" ><span>Tên file</span> </th>
                            </tr>
                          </thead>
                          <tbody >
                          ${dataStringHoSo}
                          </tbody>
                        </table>
                    </div>
                                 
                    </td>
                   
                </tr>
                <tr >
                  <td></td>
                </tr>
                <tr style="height:30px">
                  
                  <td [style.width.%]="96">
                      <div> <h5 style="font-weight: bold;height:5px">Là thành viên của đoàn </h5></div>
                  </td>
                  
                 </tr>
                 <tr>
                    
                 <td>
                 <div class="table-responsive" style="width:794px">
                 <table style="width:100%" border="1">
                       <thead>
                         <tr>
                           <th scope="col" class="text-center"><span>STT</span> </th>
                           <th scope="col" class="text-center"><span>STT đoàn</span> </th>
                           <th scope="col" class="text-center"><span>Tên đoàn</span> </th>
                           <th scope="col" class="text-center"><span>Ngày xuất cảnh</span> </th>
                           <th scope="col" class="text-center"><span>Ngày nhập cảnh</span> </th>
                           <th scope="col" class="text-center"><span>Số lượng thành viên</span> </th>
                         </tr>
                       </thead>
                       <tbody style="font-size: 12px; font-family: 'Open Sans', sans-serif;">
                        <td style="text-align: center;">1</td>
                        <td style="text-align: center;">${this.quanLyTV.drHoSoVM.maDoan}</td>
                        <td style="text-align: left;">${this.quanLyTV.drHoSoVM.tenDoan}</td>
                        <td style="text-align: center;">${this.quanLyTV.drHoSoVM.ngayXC}</td>
                        <td style="text-align: center;">${this.quanLyTV.drHoSoVM.ngayNC}</td>
                        <td style="text-align: center;">${this.quanLyTV.drHoSoVM.soLuongTV}</td>
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

