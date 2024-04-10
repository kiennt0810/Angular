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
import { Passport } from '../loaihochieu.model';
import { PassportService } from '../loaihochieu.service';
import { PassportDeleteDialogComponent } from '../delete/passport-delete.component';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'jhi-passport-mgmt',
  templateUrl: './loaihochieu.component.html',
  styleUrls: ['./loaihochieu.component.scss'],
})
export class PassportManagementComponent implements OnInit {
  currentAccount: Account | null = null;
  passports: Passport[] | null = null;
  SearchItems: Passport[] | null = null;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  nameModule = 'hộ chiếu';
  totalPage = 0;
  currentPath: string;
  roles: string;
  checkAuth = false;
  constructor(
    private passportService: PassportService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private alert: AlertServiceCheck,
    private NavbarService: NavBarService,
    private sessionStorageService: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.currentPath = this.router.url;
    this.NavbarService.getPath(this.currentPath);
    //this.accountService.identity().subscribe(account => (this.currentAccount = account));
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
  }

  // setActive(passport: Passport, isActivated: boolean): void {
  //   this.passportService.update({ ...passport, tinhTrang: isActivated }).subscribe(() => this.loadAll());
  // }

  // trackIdentity(_index: number, item: DelegationOut): number {
  //   return item.id!;
  // }

  deletePassport(passport: Passport): void {
    const modalRef = this.modalService.open(PassportDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.passport = passport;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
        this.alert.success('Xóa thành công')
      }
    });
  }

  loadAll(): void {
    this.isLoading = true;
    this.passportService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<Passport[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
        },
        error: () => (this.isLoading = false),
      });


  }

  reload() {
    window.location.reload();
  }

  onEditClick(id: number) {
    const element = this.passports.find((p) => { return p.id === id });

  }
  fields = {
    loaiHoChieu: '',
    tinhTrang: null
  };
  filter = {};

  updateFilters() {
    const dk = sessionStorage.getItem('dktk')
    if (dk && dk !== "{}") {
      this.SearchItems = this.passports;
      this.filter = JSON.parse(dk);
      this.fields = JSON.parse(dk);
      this.SearchItems = this.transform(this.SearchItems, this.filter);
      this.totalItems = Number(this.SearchItems.length);
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    } else {
      Object.keys(this.fields).forEach((key) => {
        if (key !== 'tinhTrang') {
          this.fields[key] = this.fields[key].trim();
        }
      }); Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
      this.SearchItems = this.passports;
      this.filter = Object.assign({}, this.fields);
      this.SearchItems = this.transform(this.SearchItems, this.filter);
      this.totalItems = Number(this.SearchItems.length);
      this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    }
  }

  search() {
    sessionStorage.removeItem('dktk')
    Object.keys(this.fields).forEach((key) => {
      if (key !== 'tinhTrang') {
        this.fields[key] = this.fields[key].trim();
      }
    }); Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
    this.SearchItems = this.passports;
    this.filter = Object.assign({}, this.fields);
    this.SearchItems = this.transform(this.SearchItems, this.filter);
    this.totalItems = Number(this.SearchItems.length);
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
    if (Object.keys(filter).length == 0) return items;
    let filterKeys = Object.keys(filter);
    let dk = JSON.stringify(this.filter);
    return items.filter(item => {
      return filterKeys.every(keyName => {
        if (keyName === 'tinhTrang' && (filter[keyName] === null || filter[keyName] === 'null')) {
          filter[keyName] = '';
          delete this.filter[keyName]
          sessionStorage.setItem('dktk', dk);
          return true;
        } else {
          sessionStorage.setItem('dktk', dk);
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
  // Number(headers.get('X-Total-Count'));
  private onSuccess(passport: Passport[] | null, headers: HttpHeaders): void {
    this.totalItems = passport.length;
    this.passports = passport;
    this.totalPage = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updateFilters();
  }

}
