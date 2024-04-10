import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HChieuNGService } from 'app/quanLyHoChieu/quanlyHCNgoaiGiao/service/hoCNgoaiGiao.service';
import { HoChieuNgoaiGiao } from 'app/quanLyHoChieu/quanlyHCNgoaiGiao/hoCNgoaiGiao.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'jhi-popup-sohc',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class SoHCSearchComponent implements OnInit {
  itemsPerPage = 5;
  page!: number;
  soHC: string;
  loaiHC: string;
  hoTen: string;
  chucVu: string;
  coQuan: string;
  hoChieus: HoChieuNgoaiGiao[] | null = null;
  SearchItems: HoChieuNgoaiGiao[] | null = null;
  totalItems = 0;
  isLoading = false;
  predicate!: string;
  ascending!: boolean;
  nameModule = 'hộ chiếu';
  totalPage = 0;

  constructor(
    public modal: NgbActiveModal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private HChieuNGService: HChieuNGService,
    private activeModal: NgbActiveModal
  ) { }

  fields = {
    soHC: '',
    hoTen: '',
  };
  filter = {};

  updateFilters() {
    Object.keys(this.fields).forEach(key => this.fields[key] = this.fields[key].trim());
    Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
    this.SearchItems = this.hoChieus;
    this.filter = Object.assign({}, this.fields);
    this.SearchItems = this.transform(this.SearchItems, this.filter);
    this.totalItems = Number(this.SearchItems.length);
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    this.page = 1;
  }

  transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
    if (Object.keys(filter).length == 0) return items;
    let filterKeys = Object.keys(filter);
    return items.filter(item => {
      return filterKeys.every(keyName => {
        // console.log(keyName);
        return (
          new RegExp(filter[keyName], 'gi').test(item[keyName]) ||
          filter[keyName] === ''
        );
      });
    });
  }
  ngOnInit(): void {
    this.loadAll();
  }


  loadAll(): void {
    this.isLoading = true;
    this.HChieuNGService.getLstHC().subscribe({
      next: (res: HttpResponse<HoChieuNgoaiGiao[]>) => {
        const page = 0;
        this.page = +(page ?? 1);
        this.onSuccess(res.body);
      }
    });

  }

  getData(hoChieu: HoChieuNgoaiGiao): void {
    this.soHC = hoChieu.soHC;
    this.loaiHC = hoChieu.loaiHC;
    this.hoTen = hoChieu.hoTen;
    this.chucVu = hoChieu.chucVu;
    this.coQuan = hoChieu.coQuan;
    this.modal.close({ soHC: this.soHC, loaiHC: this.loaiHC, hoTen: this.hoTen, chucVu: this.chucVu, coQuan: this.coQuan });
  }

  dismiss() {
    this.modal.dismiss();
  }

  private onSuccess(hoChieu: HoChieuNgoaiGiao[] | null): void {
    this.totalItems = hoChieu.length;
    this.hoChieus = hoChieu;
    for (let i = 0; i < hoChieu.length; i++) {
      if (i != 0) {
        hoChieu[0].stt = 1;
        hoChieu[i].stt = hoChieu[i - 1].stt + 1;
      }
      if (String(hoChieu[i].chucVu) == 'null') {
        hoChieu[i].chucVu = '';
      }
      if (String(hoChieu[i].coQuan) == 'null') {
        hoChieu[i].coQuan = '';
      }
    }
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateFilters();
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
}
