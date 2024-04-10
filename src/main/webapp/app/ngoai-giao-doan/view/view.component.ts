import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HDNgoaiGiaoVM } from '../HDNgoaiGiaoVM.model';
import { NgoaiGiaoDoanService } from '../service/ngoai-giao-doan.service';
import { HDNgoaiGiaoDtlFileVM } from '../HDNgoaiGiaoDtlFileVM.model';
import fileSaver from 'file-saver';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC } from 'app/config/navigation.constants';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
@Component({
  selector: 'jhi-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  TkForm: HDNgoaiGiaoVM | null = null;
  listFile: HDNgoaiGiaoDtlFileVM | null = null;
  totalKhach = 0;
  totalTV = 0;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  downloads = [];
  totalPage = 0;
  currentPath: string;
  tangPham: any[];
  tangPhamKhac = false;
  disableTextbox = false;
  dataTangPham: string;
  constructor(
    private Service: NgoaiGiaoDoanService,
    private route: ActivatedRoute,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private navbarService: NavBarService) {
  }
  ngOnInit(): void {
    this.tangPhamKhac = false;
    const id = this.route.snapshot.params.id;
    this.tangPham = [
      {
        id: 1,
        name: 'Hoa',
        checked: false
      },
      {
        id: 2,
        name: 'Quà',
        checked: false
      },
      {
        id: 3,
        name: 'Khác',
        checked: false
      },
    ];
    this.Service.getCurrentData(id).subscribe((result) => {
      this.TkForm = result;
      this.TkForm.tangPham = result.tangHoa;
      this.listFile = result.listHDDtlFileVM;
      this.TkForm.lsThanhPhanThamDu = result.lsThanhPhanThamDu;
      for (let j = 0; j < this.TkForm.lsThanhPhanThamDu.length; j++) {
        if (String(this.TkForm.lsThanhPhanThamDu[j].gioiTinh) == 'true') {
          this.TkForm.lsThanhPhanThamDu[j].gioiTinh = 'Nam';
        } else if (String(this.TkForm.lsThanhPhanThamDu[j].gioiTinh) == 'false') {
          this.TkForm.lsThanhPhanThamDu[j].gioiTinh = 'Nữ';
        } else {
          this.TkForm.lsThanhPhanThamDu[j].gioiTinh = '';
        }
      }
      if (String(this.TkForm.quocGia) == 'null') {
        this.TkForm.quocGia = '';
      }
      this.totalItems = Number(this.TkForm.lsThanhPhanThamDu.length);
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
      this.page = 1;
      if (String(result.tangHoa) != 'undefined') {
        let temp = this.TkForm.tangPham.split(',');
        for (let j = 0; j < this.tangPham.length; j++) {
          for (let i = 0; i < temp.length; i++) {
            if (temp[i] == this.tangPham[j].id) {
              this.tangPham[j].checked = true;
            }
            if (String(temp[i]) != '1' && String(temp[i]) != '2' && String(temp[i]) != '3' && String(temp[i]) != 'null') {
              this.tangPhamKhac = true;
              this.dataTangPham = temp[i];
            } else {
              this.dataTangPham = '';
              this.tangPhamKhac = false;
            }
          }
        }
      }

    });
    this.currentPath = this.router.url;
    this.navbarService.getSubPath(this.currentPath, 'Xem');

  }


  get result() {
    this.tangPhamKhac = false;
    var tangPham = this.tangPham.filter(item => item.checked).map(item => item);
    for (let i = 0; i < tangPham.length; i++) {
      if (tangPham[i].name == 'Khác') {
        this.tangPhamKhac = true;
      }
    }
    return this.tangPhamKhac;
  }
  // downloadFile(form : HDNgoaiGiaoDtlVM) {
  //   for(let i=0;i<form.listHDDtlFileVM.length;i++){
  //     this.Service.downloadFile(form.listHDDtlFileVM[i].id).subscribe((response: any) => {
  //       let blob:any = new Blob([response], { type: 'application/json; charset=utf-8' });
  //       fileSaver.saveAs(blob, form.listHDDtlFileVM[i].fileName);
  //     }), (error: any) => console.log('Error downloading the file');
  //   }

  // }
  transition(): void {
    const id = this.route.snapshot.params.id;
    this.router.navigate(['./view/' + id], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        sort: `${this.predicate},${this.ascending ? ASC : DESC}`,
      },
    });
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

}