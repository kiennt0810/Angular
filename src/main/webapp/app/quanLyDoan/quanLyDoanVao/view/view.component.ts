import { ActivatedRoute, Router } from '@angular/router';

import { DelegationIn } from '../doanVao.model';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CategoriesManagementService } from '../service/categories-management.service';
import { FileUploadVM } from '../../file.model';
import * as fileSaver from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { User } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.model';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { QuanLyNguoiSuDungService } from 'app/quanTriHeThong/quanlyNguoiSuDung/quanlynguoisudung.service';

@Component({
  selector: 'jhi-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class DoanVaoViewComponent implements OnInit {
  doanVao: DelegationIn | null = null;
  listFile: FileUploadVM | null = null;
  downloads= [];
  citems: User[] | null = null;
  nguoiLap: string;
  nguoiSua: string;
  constructor(
    private Service: CategoriesManagementService,
    private qGService: QuocgiavavunglanhthoService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: QuanLyNguoiSuDungService) { }
  anNinh  = [
    {
      id:1,
      name:'Cảnh sát dẫn đường',
      checked: false
    },
    {
      id:2,
      name:'Tiếp cận trưởng đoàn',
      checked: false
    },
    {
      id:3,
      name:'Xe y tế tháp tùng',
      checked: false
    },
    {
      id:4,
      name:'Xe y tế đón, tiễn',
      checked: false
    },
    {
      id:5,
      name:'Bác sĩ tháp tùng đi địa phương',
      checked: false
    },
  ];

  inputChecked(data: any) {
    let checked = false;
    //console.log(this.category.measurements[i].measurements);
    //console.log('data = ', data);
    for (
      let l = 0;
      l < this.anNinh.length;
      l++
    ) {
      let temp = this.doanVao.anNinh.split(',');
      for (let index = 0; index < temp.length; index++) {
        if (temp[index] == data.id) {
          checked = true;
        }  
      }
      //console.log('inside =',temp);
    }
    return checked;
  }
  ngOnInit(): void {
    console.log(this.route.snapshot.params.maDoan);
    this.qGService
      .getAll()
      .subscribe({
        next: (res: HttpResponse<User[]>) => {
          this.onSuccessQG(res.body, res.headers);
        },
      });
    const id = this.route.snapshot.params.maDoan;
    this.Service.getCurrentData(id).subscribe((result) => {
      this.doanVao = result;
      this.listFile = result.listDVFileVM;
      if (this.doanVao.createdBy) {
        this.nguoiLap = this.doanVao.createdBy;
      }
      if (this.doanVao.updatedBy) {
        this.nguoiSua = this.doanVao.updatedBy;
      }
    });
  }
  private onSuccessQG(qG: User[] | null, headers: HttpHeaders): void {
    this.citems = qG;
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
    let dataStringAnNinh: string = "";
    for(let i=0;i<this.doanVao.listDVFileVM.length;i++){
      dataStringHoSo = dataStringHoSo + '<tr>' 
      +'<td class="text-center">'+ (i+1)
      +'</td>'
      +'<td class="data-text">'+ this.doanVao.listDVFileVM[i].fileName +'</td>'
    '</tr>';
    }

    for(let i=0;i<this.doanVao.listLanhDao.length;i++){
      dataStringLdtd = dataStringLdtd + '<tr>' 
      +'<td class="text-center">'+ (i+1)
      +'</td>'
      +'<td class="data-text">'+ this.doanVao.listLanhDao[i].hoTen +'</td>'

    '</tr>';
    }

    for(let i=0;i<this.anNinh.length;i++){
      this.inputChecked(this.anNinh[i]);
      if( this.inputChecked(this.anNinh[i]) == true)
          dataStringAnNinh = dataStringAnNinh + '<p>'
          +'<input type="checkbox"'
          +' checked/>'
          +'&nbsp;' + this.anNinh[i].name
          +'</p>';
      else
        dataStringAnNinh = dataStringAnNinh + '<p>'
        +'<input type="checkbox"/>'
        +'&nbsp;' + this.anNinh[i].name
        +'</p>';

       
    }

  for(let i=0;i<this.doanVao.listHDTaiDP.length;i++){
    dataStringHddp = dataStringHddp + '<tr>' 
    +'<td class="text-center">'+ (i+1)
    +'</td>'
    +'<td class="data-text">'+ this.doanVao.listHDTaiDP[i].diaPhuong +'</td>'
    +'<td class="text-center">'+ this.doanVao.listHDTaiDP[i].tuNgay +'</td>'
    +'<td class="text-center">'+ this.doanVao.listHDTaiDP[i].denNgay +'</td>'
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
                <div class="col d-flex justify-content-start"><input class="form-control" readonly type="text" value="${ this.doanVao.maDoan}"></div>
              </td>
              
            </tr>
            <tr>
                
                <td [style.width.%]="20">
                  <h5 >Tên đoàn</h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanVao.tenDoan}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Trưởng đoàn</h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanVao.truongDoan}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Quốc gia </h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanVao.quocGia}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Mục đích hoạt động </h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanVao.mucDichHD}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="15">
                    <h5 class="text-center">Ngày nhập cảnh</h5>
                  </td>
                <td [style.width.%]="25">
                    <div class="input-group">
                        <input class="form-control disableDiv" readonly type="text"  value="${ this.doanVao.ngayNC}"/>
                    </div>
                </td>
                <td [style.width.%]="15">
                    <h5 class="text-center" style="padding-left:20px">Ngày xuất cảnh</h5>
                  </td>
                <td [style.width.%]="25"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text"  value="${ this.doanVao.ngayXC}"/>
                    </div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Số ngày lưu trú tại Việt Nam</h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanVao.soNgay == null ? 0 : this.doanVao.soNgay }"></div>
                </td>
                
              </tr>
              <tr>
               
                <td [style.width.%]="20">
                  <h5 >Nơi lưu trú</h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanVao.noiLuuTru}"></div>
                </td>
               
              </tr>

              <tr class="d-flex">
               
                <td [style.width.%]="20" style="vertical-align: text-top !important;">
                  <h5 >An ninh chăm sóc sức khỏe</h5>
                </td>
                <td colspan="4">
                  ${dataStringAnNinh}
               </td>
              </tr>

              <tr>
               
              <td [style.width.%]="20">
                <h5 >Số lượng thành viên trong đoàn</h5>
              </td>
              <td colspan="1">
                <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanVao.soLuongTV == null ? 0  : this.doanVao.soLuongTV }"></div>
              </td>
              <td colspan="3">
                <div class="col d-flex justify-content-start">người</div>
              </td>
             
            </tr>

            <td [style.width.%]="20">
                <h5 >Ghi chú</h5>
              </td>
              <td colspan="4">
                <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${ this.doanVao.ghiChu}"></div>
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
                          <th scope="col" class="text-center" ><span>Địa phương</span> </th>    
                          <th scope="col" class="text-center" style="width:15%; "><span>Từ ngày</span> </th>
                          <th scope="col" class="text-center" style="width:15%; "><span>Đến ngày</span> </th>                     
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

