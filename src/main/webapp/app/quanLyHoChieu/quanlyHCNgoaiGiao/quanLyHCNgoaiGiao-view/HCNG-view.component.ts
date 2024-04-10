import { ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { HoChieuNgoaiGiao } from '../hoCNgoaiGiao.model';
import { HChieuNGService } from '../service/hoCNgoaiGiao.service';
import * as fileSaver from 'file-saver';
import { FileUploadHC } from '../file-HC.model';
import { DomSanitizer } from '@angular/platform-browser';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';


const HCNGTemplate = {} as HoChieuNgoaiGiao;

const editHCNG: HoChieuNgoaiGiao = {
} as HoChieuNgoaiGiao;

@Component({
  selector: 'jhi-viewPassport-mgmt',
  templateUrl: './HCNG-view.component.html',
  styleUrls: ['./HCNG-view.component.scss'],
})
export class HCNgoaiGiaoViewComponent implements OnInit {
  hoChieuNgoaiGiao: HoChieuNgoaiGiao | null = null;
  listFile: FileUploadHC | null = null;
  downloads = [];
  imagePrint: any;
  currentPath: string;

  viewForm = new FormGroup({
    soHC: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    hoTen: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(254)] }),
    gioiTinh: new FormControl(''),
    cmndSo: new FormControl(''),
    ngaySinh: new FormControl(''),
    noiSinh: new FormControl(''),
    imgFile: new FormControl(''),
    chucVu: new FormControl(''),
    coQuan: new FormControl(''),
    loaiHC: new FormControl(''),
    cmndNgayCap: new FormControl(''),
    tGianHetHan: new FormControl(''),
    cmndNoiCap: new FormControl(''),
    fileHoSo: new FormControl(''),
  });

  constructor(private Service: HChieuNGService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private navbarService: NavBarService,
    private router: Router,
    ) {}

  ngOnInit(): void {
    let gioiTinh = '';
    const soHC = this.route.snapshot.params.soHC;
    this.Service.getCurrentGNHC(soHC).subscribe((result) => {
      this.hoChieuNgoaiGiao = result;
      this.listFile = result.listHCFileVM;
      if (String(result['gioiTinh']) == 'true') {
        gioiTinh = 'Nam';
      } else if (String(result['gioiTinh']) == 'false') {
        gioiTinh = 'Nữ';
      } else {
        gioiTinh = '';
      }

      this.viewForm = new FormGroup({
        soHC: new FormControl(result['soHC']),
        hoTen: new FormControl(result['hoTen']),
        gioiTinh: new FormControl(gioiTinh),
        cmndSo: new FormControl(result['cmndSo'] == 'null' ? "" : result['cmndSo']),
        ngaySinh: new FormControl(result['ngaySinh']),
        noiSinh: new FormControl(result['noiSinh'] == 'null' ? "" : result['noiSinh']),
        imgFile: new FormControl(result['imgFile']),
        chucVu: new FormControl(result['chucVu'] == 'null' ? "" : result['chucVu']),
        coQuan: new FormControl(result['coQuan'] == 'null' ? "" : result['coQuan']),
        loaiHC: new FormControl(result['loaiHC']),
        cmndNgayCap: new FormControl(result['cmndNgayCap']),
        tGianHetHan: new FormControl(result['cmndNgayHL']),
        cmndNoiCap: new FormControl(result['cmndNoiCap'] == 'null' ? "" : result['cmndNoiCap']),
        fileHoSo: new FormControl(result['fileHoSo'])
      });

      for (let i = 0; i < result.listHCFileVM.length; i++) {
        if (this.listFile[i].type == 0) {
          this.downloadImg(this.listFile[i].id);
        }

      }
    });
    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Xem')
  }

  previousState(): void {
    window.history.back();
  }

  downloadFile(id: number, name: string) {
    this.Service.downloadFile(id).subscribe((response: any) => {
      let blob: any = new Blob([response], { type: 'application/json; charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, name);
    }), (error: any) => console.log('Error downloading the file');
  }
  imageUrl: any;
  downloadImg(id: number) {
    this.Service.downloadFile(id).subscribe((data: Blob) => {
      let objectURL = URL.createObjectURL(data);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.imagePrint = URL.createObjectURL(data);
    }), (error: any) => console.log('Error downloading the file');
  }

  Print() {
    let dataStringHoSo: string ="";
    for(let i = 0; i < this.hoChieuNgoaiGiao.listHCFileVM.length; i++){
      dataStringHoSo = dataStringHoSo + '<tr>' 
      +'<td class="text-center">'+ (i+1)
      +'</td>'
      +'<td class="data-text">'+ this.hoChieuNgoaiGiao.listHCFileVM[i].fileName +'</td>'
    '</tr>';
    }
    if (String(this.hoChieuNgoaiGiao.gioiTinh) == 'true') {
      this.hoChieuNgoaiGiao.gioiTinh = 'Nam';
    } else if (String(this.hoChieuNgoaiGiao.gioiTinh) == 'false') {
      this.hoChieuNgoaiGiao.gioiTinh = 'Nữ';
    } else {
      this.hoChieuNgoaiGiao.gioiTinh = '';
    }
    const printWindow = window.open('', 'PRINT');
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
                <h5 >Số hộ chiếu</h5>
              </td>
              <td colspan="4">
                <div class="col d-flex justify-content-start"><input class="form-control" readonly type="text" value="${this.hoChieuNgoaiGiao.soHC}"></div>
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
                  <h5 >Họ và tên </h5>
                </td>
                <td colspan="4">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${this.hoChieuNgoaiGiao.hoTen}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td colspan="1">
                    <h5 class="text-center">Giới tính</h5>
                  </td>
                <td colspan="1">
                    <div class="input-group">
                        <input class="form-control disableDiv" readonly type="text"  value="${this.hoChieuNgoaiGiao.gioiTinh}"/>
                    </div>
                </td>
                <td colspan="1"></td>
                <td colspan="1">
                    <h5 class="text-center" style="padding-left:50px;">CCCD</h5>
                  </td>
                <td colspan="1"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text"  value="${this.hoChieuNgoaiGiao.cmndSo == 'null' ? "" : this.hoChieuNgoaiGiao.cmndSo}"/>
                    </div>
                </td>
                
              </tr>

              <tr>
                
                <td colspan="1">
                    <h5 class="text-center">Ngày sinh</h5>
                  </td>
                <td colspan="1">
                    <div class="input-group">
                        <input class="form-control disableDiv" readonly type="text"  value="${this.hoChieuNgoaiGiao.ngaySinh == 'null' ? "" : this.hoChieuNgoaiGiao.ngaySinh}"/>
                    </div>
                </td>
                <td colspan="1"></td>
                <td colspan="1">
                    <h5 class="text-center" style="padding-left:50px;">Nơi sinh</h5>
                  </td>
                <td colspan="1"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text"  value="${this.hoChieuNgoaiGiao.noiSinh == 'null' ? "" : this.hoChieuNgoaiGiao.noiSinh}"/>
                    </div>
                </td>
                
              </tr>

              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Chức vụ</h5>
                </td>
                <td colspan="5">  
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${this.hoChieuNgoaiGiao.chucVu == 'null' ? "" : this.hoChieuNgoaiGiao.chucVu}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Cơ quan</h5>
                </td>
                <td colspan="5">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${this.hoChieuNgoaiGiao.coQuan == 'null' ? "" : this.hoChieuNgoaiGiao.coQuan}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="20">
                  <h5 >Loại hộ chiếu</h5>
                </td>
                <td colspan="5">
                  <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${this.hoChieuNgoaiGiao.loaiHC == 'null' ? "" : this.hoChieuNgoaiGiao.loaiHC}"></div>
                </td>
                
              </tr>
              <tr>
                
                <td [style.width.%]="15">
                    <h5 class="text-center">Ngày cấp</h5>
                  </td>
                <td [style.width.%]="25">
                    <div class="input-group">
                        <input class="form-control disableDiv" readonly type="text"  value="${this.hoChieuNgoaiGiao.cmndNgayCap == 'null' ? "" : this.hoChieuNgoaiGiao.cmndNgayCap}"/>
                    </div>
                </td>
                <td [style.width.%]="15"></td>
                <td [style.width.%]="25"></td>
                <td [style.width.%]="15">
                    <h5 class="text-center" style="padding-left:50px">Có giá trị đến</h5>
                  </td>
                <td [style.width.%]="25"><div class="input-group">
                         <input class="form-control disableDiv" readonly type="text" value="${this.hoChieuNgoaiGiao.cmndNgayHL == 'null' ? "" : this.hoChieuNgoaiGiao.cmndNgayHL}"/>
                    </div>
                </td>
                
              </tr>   
              
              <tr>
                
              <td [style.width.%]="20">
                <h5 >Nơi cấp</h5>
              </td>
              <td colspan="5">
                <div class="col d-flex justify-content-start"><input class="form-control disableDiv" readonly type="text" value="${this.hoChieuNgoaiGiao.cmndNoiCap == 'null' ? "" : this.hoChieuNgoaiGiao.cmndNoiCap}"></div>
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
