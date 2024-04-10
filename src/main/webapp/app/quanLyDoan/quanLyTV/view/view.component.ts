import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileUploadVM } from '../../file.model';
import * as fileSaver from 'file-saver';
import { QuanLyTVService } from '../service/quanLyTV.service';
import { QuanLyTV } from '../quanLyTV.model';
import { DomSanitizer } from '@angular/platform-browser';
import { QuanLyNguoiSuDungService } from 'app/quanTriHeThong/quanlyNguoiSuDung/quanlynguoisudung.service';

@Component({
  selector: 'jhi-user-mgmt-detail',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class QuanLyTvViewComponent implements OnInit {
  quanLyTV: QuanLyTV | null = null;
  listFile: FileUploadVM | null = null;
  downloads= [];
  gioiTinh: any;
  idAnh: number;
  nguoiLap: string;
  nguoiSua: string;
  constructor(
    private Service: QuanLyTVService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userService: QuanLyNguoiSuDungService,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params.maTV;
    this.Service.getCurrentData(id).subscribe((result) => {
      this.quanLyTV = result;
      this.listFile = result.listTVFileVM;
      for (let i = 0; i < result.listTVFileVM.length; i++) {
        if (this.listFile[i].type == 0) {
          this.downloadImg(this.listFile[i].id);
          this.idAnh = this.listFile[i].id
        }
      }
      if (this.quanLyTV.createdBy) {
        this.nguoiLap = this.quanLyTV.createdBy;
      }
      if (this.quanLyTV.updatedBy) {
        this.nguoiSua = this.quanLyTV.updatedBy;
      }
    });
  }

  downloadFile(id: number, name: string) {
    this.Service.downloadFile(id).subscribe((response: any) => {
      let blob:any = new Blob([response], { type: 'application/json; charset=utf-8' });
      // const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, name);
    }), (error: any) => console.log('Error downloading the file');
  }

  previousState(): void {
    window.history.back();
  }
  imageUrl: any;
  imagePrint:any
  downloadImg(id: number) {
    this.Service.downloadFile(id).subscribe((data: Blob) => {
      let objectURL = URL.createObjectURL(data);       
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.imagePrint = URL.createObjectURL(data);
      console.log(this.imageUrl)
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
    <body><div style="background-color: white; width:794px" id="print" class="data-text">
    <div>
        <div>
          <table class="table-space"  style="width:794px">
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
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.quanLyTV.hoTen}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Họ tên phiên âm tiếng việt</h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.quanLyTV.hoTenPA}"></div>
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
                <td style="width: 10%">
                    <h5 style="padding-left:5px;">Ngày sinh</h5>
                  </td>
                <td [style.width.%]="25"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.ngaySinh}"/>
                    </div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Quốc gia </h5>
                </td>
                <td colspan="5">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.quanLyTV.quocGia}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Cơ quan </h5>
                </td>
                <td colspan="5">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.quanLyTV.coQuan}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Chức vụ </h5>
                </td>
                <td colspan="5">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.quanLyTV.chucVu}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="15">
                    <h5>Số hộ chiếu</h5>
                  </td>
                <td [style.width.%]="25">
                    <div class="input-group">
                        <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.soHoChieu}"/>
                    </div>
                </td>
                <td style="width: 10%">
                    <h5 style="padding-left:4px">Ngày cấp</h5>
                  </td>
                <td [style.width.%]="25"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.hC_NgayCap}"/>
                    </div>
                </td>
                <td [style.width.%]="15">
                    <h5 style="padding-left:11px">Ngày hết hạn</h5>
                  </td>
                <td [style.width.%]="25"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.hC_NgayHL}"/>
                    </div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Loại hộ chiếu </h5>
                </td>
                <td colspan="5">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.quanLyTV.hC_Loai}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="15">
                    <h5>Số thị thực</h5>
                  </td>
                <td [style.width.%]="25">
                    <div class="input-group">
                        <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.hC_SoThiThuc}"/>
                    </div>
                </td>
                <td [style.width.%]="15"></td>
                <td [style.width.%]="25"></td>
                <td [style.width.%]="15">
                    <h5 style="padding-left:4px">Ngày cấp thị thực</h5>
                  </td>
                <td [style.width.%]="25"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.hC_NgayCapTT}"/>
                    </div>
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
                    <h5>Ngày nhập cảnh</h5>
                  </td>
                <td [style.width.%]="25">
                    <div class="input-group">
                        <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.ngayNC}"/>
                    </div>
                </td>
                <td [style.width.%]="15"></td>
                <td [style.width.%]="25"></td>
                <td [style.width.%]="15">
                    <h5 style="padding-left:3px">Ngày xuất cảnh</h5>
                  </td>
                <td [style.width.%]="25"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text"  value="${this.quanLyTV.ngayXC}"/>
                    </div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Tình trạng sức khỏe</h5>
                </td>
                <td colspan="5">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${this.quanLyTV.tinhTrangSK}"></div>
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
              <tr>
                
              <td [style.width.%]="15">
                  <h5>Người tạo</h5>
                </td>
              <td colspan="2">
                  <div class="input-group" >
                      <input class="form-control disableDiv" readonly type="text"  value="${this.nguoiLap == undefined? "" : this.nguoiLap}"/>
                  </div>
              </td>

              <td [style.width.%]="15">
                  <h5 style="padding-left:50px">Người sửa</h5>
                </td>
              <td colspan="2"><div class="input-group">
                       <input class="form-control disableDiv" readonly type="text"  value="${this.nguoiSua == undefined? "" : this.nguoiSua}"/>
                  </div>
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
                <tr style="height:30px"">
                  
                  <td [style.width.%]="96">
                      <div> <h5 style="font-weight: bold;height:5px">Là thành viên của đoàn </h5></div>
                  </td>
                  
                 </tr>
                 <tr>
                    
                 <td>
                 <div class="table-responsive" style="width:794px">
                 <table class="table table-striped" aria-describedby="user-management-page-heading" style="width:100%" border="1">
                       <thead>
                         <tr>
                           <th scope="col" class="text-center" style="width:5%;"><span>STT</span> </th>
                           <th scope="col" class="text-center"><span>STT đoàn</span> </th>
                           <th scope="col" class="text-center" style="width:37%;"><span>Tên đoàn</span> </th>
                           <th scope="col" class="text-center" style="width:14%;"><span>Quốc gia</span> </th>
                           <th scope="col" class="text-center"><span>Ngày nhập cảnh</span> </th>
                           <th scope="col" class="text-center"><span>Ngày xuất cảnh</span> </th>
                           <th scope="col" class="text-center" style="width:9%;"><span>Số lượng thành viên</span> </th>
                         </tr>
                       </thead>
                       <tbody >
                        <td class="text-center">1</td>
                        <td class="text-center" ><input class="form-control disableDiv" readonly type="text" style="border-style: none;" value="${this.quanLyTV.dvHoSoVM.maDoan}"></td>
                        <td style="padding-right: 4px"><div class="form-control disableDiv data-text" style="border-style: none; ">${this.quanLyTV.dvHoSoVM.tenDoan}</div></td>
                        <td><input class="form-control disableDiv" readonly type="text" style="border-style: none;" value="${this.quanLyTV.dvHoSoVM.quocGia}"></td>
                        <td class="text-center" ><input class="form-control disableDiv" style="border-style: none; text-align: center;" readonly type="text" value="${this.quanLyTV.dvHoSoVM.ngayNC}"></td>
                        <td class="text-center" ><input class="form-control disableDiv" style="border-style: none; text-align: center;" readonly type="text" value="${this.quanLyTV.dvHoSoVM.ngayXC}"></td>
                        <td class="text-center" ><input class="form-control disableDiv" style="border-style: none; text-align: center;" readonly type="text" value="${this.quanLyTV.dvHoSoVM.soLuongTV}"></td>
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

