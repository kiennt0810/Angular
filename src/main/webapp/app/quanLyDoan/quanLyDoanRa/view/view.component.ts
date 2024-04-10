import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileUploadVM } from '../../file.model';
import * as fileSaver from 'file-saver';
import { DoanRa } from '../doanRa.model';
import { DoanRaService } from '../service/delegation-out.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

@Component({
  selector: 'jhi-user-mgmt-detail',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class DoanRaViewComponent implements OnInit {
  doanRa: DoanRa | null = null;
  listFile: FileUploadVM | null = null;
  downloads= [];
  currentPath: string;
  nguoiLap: string;
  nguoiSua: string;
  constructor(
    private Service: DoanRaService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder, 
    private router: Router,
    private navbarService: NavBarService) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.params.maDoan);
    const id = this.route.snapshot.params.maDoan;
    this.Service.getCurrentData(id).subscribe((result) => {
      this.doanRa = result;
      this.listFile = result.listDVFileVM;
      if (this.doanRa.createdBy) {
        this.nguoiLap = this.doanRa.createdBy;
      }
      if (this.doanRa.updatedBy) {
        this.nguoiSua = this.doanRa.updatedBy;
      }
    });
    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Xem')
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

  print():void{ 
    const printWindow = window.open('','PRINT');
    let dataStringHoSo: string ="";
    let dataStringLdtd: string = "";
    let dataStringHddp: string = "";
    for(let i=0;i<this.doanRa.listDRFileVM.length;i++){
      dataStringHoSo = dataStringHoSo + '<tr>' 
      +'<td class="text-center">'+ (i+1)
      +'</td>'
      +'<td class="data-text">'+ this.doanRa.listDRFileVM[i].fileName +'</td>'
    '</tr>';
    }

    for(let i=0;i<this.doanRa.listLanhDao.length;i++){
      dataStringLdtd = dataStringLdtd + '<tr>' 
      +'<td class="text-center">'+ (i+1)
      +'</td>'
      +'<td class="data-text">'+ this.doanRa.listLanhDao[i].hoTen +'</td>'

    '</tr>';
    }

  for(let i=0;i<this.doanRa.listHoSoDtl.length;i++){
    if(this.doanRa.listHoSoDtl[i].soLuongTV == null) {
      this.doanRa.listHoSoDtl[i].soLuongTV = 0;
    }
    if(this.doanRa.listHoSoDtl[i].soNgayLuuTru == null) {
      this.doanRa.listHoSoDtl[i].soNgayLuuTru = 0;
    }
    dataStringHddp = dataStringHddp + '<tr>' 
    +'<td class="text-center">'+ (i+1)
    +'</td>'
    +'<td class="data-text">'+ this.doanRa.listHoSoDtl[i].quocGia +'</td>'
    +'<td class="data-text">'+ this.doanRa.listHoSoDtl[i].chuongTrinhHD +'</td>'
    +'<td class="text-center">'+ this.doanRa.listHoSoDtl[i].soLuongTV +'</td>'
    +'<td class="data-text">'+ this.doanRa.listHoSoDtl[i].noiLuuTru +'</td>'
    +'<td class="text-center">'+ this.doanRa.listHoSoDtl[i].soNgayLuuTru +'</td>'
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
                <h5 >STT đoàn</h5>
              </td>
              <td colspan="4">
                <div class="col d-flex justify-content-start"><input class="form-control" readonly type="text" value="${ this.doanRa.maDoan}"></div>
              </td>
              
            </tr>
            <tr>
                
                <td [style.width.%]="20">
                  <h5 >Tên đoàn</h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanRa.tenDoan}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Trưởng đoàn</h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanRa.truongDoan}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Chức vụ</h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanRa.chucVu}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Mục đích hoạt động </h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanRa.mucDichHD}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="15">
                    <h5>Ngày xuất cảnh</h5>
                  </td>
                <td [style.width.%]="25"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text"  value="${ this.doanRa.ngayXC}"/>
                    </div>
                </td>
                <td [style.width.%]="15">
                    <h5>Ngày nhập cảnh</h5>
                  </td>
                <td [style.width.%]="25">
                    <div class="input-group">
                        <input class="form-control disableDiv" readonly type="text"  value="${ this.doanRa.ngayNC}"/>
                    </div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Ghi chú</h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanRa.ghiChu }"></div>
                </td>
                
              </tr>

              <tr>
               
              <td [style.width.%]="20">
                <h5 >Số lượng thành viên trong đoàn</h5>
              </td>
              <td colspan="1">
                <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanRa.soLuongTV == null ? 0  : this.doanRa.soLuongTV }"></div>
              </td>
              <td colspan="3">
                <div class="col d-flex justify-content-start">người</div>
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
                      <div> <h5 style="font-weight: bold;height:5px">Lãnh đạo tiếp đoàn </h5></div>
                  </td>
                  
                 </tr>
                 <tr>
                    
                 <td>
                 <div class="table-responsive" style="width:794px">
                 <table class="table table-striped" aria-describedby="user-management-page-heading" style="width:100%" border="1">
                       <thead>
                         <tr>
                           <th scope="col" class="text-center" style="width:10%;"><span>STT</span> </th>
                           <th scope="col" class="text-center"><span>Họ và tên</span> </th>
                         </tr>
                       </thead>
                       <tbody >
                       ${dataStringLdtd}
                       </tbody>
                     </table>
                 </div>
                              
                 </td>
                
             </tr>
              <tr >
                <td></td>
              </tr>
              <tr>
                
                <td [style.width.%]="90">
                    <div> <h5 style="font-weight: bold;height:5px">Hoạt động tại các địa phương</h5></div>
                </td>
                
               </tr>
              <tr>
                
                <td [style.width.%]="96"> 
                <div class="table-responsive" style="width:794px">
                <table class="table table-striped" aria-describedby="user-management-page-heading" style="width:794px"  border="1">
                      <thead>
                        <tr>
                          <th scope="col" class="text-center" style="width:10%;"><span>STT</span> </th>
                          <th scope="col" class="text-center" style="width:16%;"><span>Quốc gia</span> </th>    
                          <th scope="col" class="text-center" style="width:25%;"><span>Chương trình hoạt động</span> </th>
                          <th scope="col" class="text-center" style="width:9%;"><span>Số lượng thành viên</span> </th> 
                          <th scope="col" class="text-center"><span>Nơi lưu trú</span> </th>         
                          <th scope="col" class="text-center" style="width:9%;"><span>Số ngày lưu trú</span> </th>     
                        </tr>
                      </thead>
                      <tbody >
                        ${dataStringHddp}
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

