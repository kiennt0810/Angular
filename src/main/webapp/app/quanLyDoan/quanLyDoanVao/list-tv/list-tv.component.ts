import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ASC, DESC } from 'app/config/navigation.constants';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { AlertService } from 'app/core/util/alert.service';
import { QuanLyTV } from 'app/quanLyDoan/quanLyTV/quanLyTV.model';
import { QuanLyTVService } from 'app/quanLyDoan/quanLyTV/service/quanLyTV.service';
import { combineLatest } from 'rxjs';
@Component({
  selector: 'jhi-list-tv',
  templateUrl: './list-tv.component.html',
  styleUrls: ['./list-tv.component.scss']
})
export class ListTVComponent implements OnInit {
  @Input() maDoan: number;
  page!: number;
  isLoading = false;
  itemsPerPage = ITEMS_PER_PAGE;
  predicate!: string;
  ascending!: boolean;
  totalItems = 0;
  qlyTV: QuanLyTV[] | null = null;
  fields = {
    maHSDoan: '',
  };
  filter = {};

  constructor(
    private qltvService: QuanLyTVService,
    public modal: NgbActiveModal, 
    private toast: AlertService,
    private activatedRoute: ActivatedRoute,
    ) {}

  ngOnInit(): void {
    this.handleNavigation();
    this.fields.maHSDoan = this.maDoan.toString();
    
  }

  transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
    if (Object.keys(filter).length == 0) return items;
    console.log(filter);

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

  updateFilters() {
    Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
    this.filter = Object.assign({}, this.fields);
  }

  save() {}

  close() {
    this.modal.close();
  }

  dismiss() {
    this.modal.dismiss();
  }

  private handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      this.page = +(page ?? 1);
      this.loadAll();
    });
  }

  private sort(): string[] {
    const result = [`${this.predicate},${this.ascending ? ASC : DESC}`];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  loadAll(): void {
    this.isLoading = true;
    this.qltvService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<QuanLyTV[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
        },
        error: () => (this.isLoading = false),
      });
  }

  private onSuccess(qlyTV: QuanLyTV[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(qlyTV.length);
    this.fields.maHSDoan = this.maDoan.toString();
    this.updateFilters();
    this.qlyTV = this.transform(qlyTV,this.filter);
    this.totalItems = Number(this.qlyTV.length);
    console.log(this.qlyTV)
  }

}
