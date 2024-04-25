import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT } from 'app/config/navigation.constants';
import { Account } from 'app/core/auth/account.model';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { SessionStorageService } from 'ngx-webstorage';
import { Brand } from 'app/quanlydanhmuc/Brand/Brand.model';
import { BrandService } from 'app/quanlydanhmuc/Brand/Brand.service';
import { ProductDeleteDialogComponent } from '../delete/delete.component';

@Component({
  selector: 'jhi-passport-mgmt',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ProductManagementComponent implements OnInit {
  currentAccount: Account | null = null;
  products: Product[] | null = null;
  SearchItems: Product[] | null = null;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  nameModule = 'sản phẩm';
  totalPage = 0;
  currentPath: string;
  roles: string;
  brands: Brand[] | null = null;
  checkAuth = false;
  constructor(
    private Service: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private BrandService: BrandService,
    private alert: AlertServiceCheck,
    private NavbarService: NavBarService,
    private sessionStorageService: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.currentPath = this.router.url;
    this.NavbarService.getPath(this.currentPath);
    this.activatedRoute.queryParams.subscribe(params => {
      this.page = params['page'];
      this.handleNavigation();
      this.roles = this.sessionStorageService.retrieve('roles');
      for (let i = 0; i < this.roles.length; i++) {
        if (this.roles[i] == '09000') {
          this.checkAuth = true;
        }
      }
    })
    this.loadAllBrand();
  }

  deleteObj(product: Product): void {
    const modalRef = this.modalService.open(ProductDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.product = product;
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
        this.alert.success('Xóa thành công');
      }
    });
  }

  loadAll(): void {
    this.isLoading = true;
    this.Service
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<Product[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
        },
        error: () => (this.isLoading = false),
      });


  }

  reload() {
    window.location.reload();
  }

  fields = {
    tenSp: '',
    thuongHieu: ''
  };
  filter = {};

  updateFilters() {
      this.SearchItems = this.products;
    Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
      this.SearchItems = this.products;
      this.filter = Object.assign({}, this.fields);
      this.SearchItems = this.transform(this.SearchItems, this.filter);
      this.totalItems = Number(this.SearchItems.length);
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  search() {
    sessionStorage.removeItem('dktk');
    Object.keys(this.fields).forEach((key) => {
      if (key !== 'trangThai') {
        this.fields[key] = this.fields[key].trim();
      }
    }); Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
    this.SearchItems = this.products;
    this.filter = Object.assign({}, this.fields);
    this.SearchItems = this.transform(this.SearchItems, this.filter);
    this.totalItems = Number(this.SearchItems.length);
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
    if (Object.keys(filter).length == 0) return items;
    let filterKeys = Object.keys(filter);
    return items.filter(item => {
      return filterKeys.every(keyName => {
        if (keyName === 'trangThai' && (filter[keyName] === null || filter[keyName] === 'null')) {
          filter[keyName] = '';
          delete this.filter[keyName]
          return true;
        } else {
          return (
            new RegExp(filter[keyName], 'gi').test(item[keyName]) ||
            filter[keyName] === ''
          );
        }
      });
    });
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



  private handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      this.page = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      this.predicate = sort[0];
      this.ascending = sort[1] === ASC;
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

  private onSuccess(obj: Product[] | null, headers: HttpHeaders): void {
    this.totalItems = obj.length;
    this.products = obj;
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateFilters();
  }

  loadAllBrand(): void {
    this.BrandService.getLstBrand().subscribe({
      next: (res: HttpResponse<Brand[]>) => {
        this.onSuccessLstBrand(res.body);
      }
    });
  }
  private onSuccessLstBrand(brand: Brand[] | null): void {
    this.brands = brand;
  }

}
