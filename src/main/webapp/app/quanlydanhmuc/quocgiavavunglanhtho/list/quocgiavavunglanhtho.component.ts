import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ASC, DESC, SORT } from 'app/config/navigation.constants';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { combineLatest } from 'rxjs';
import { User } from '../quocgiavavunglanhtho.model';
import { Account } from 'app/core/auth/account.model';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { QuocgiavavunglanhthoService } from 'app/quanlydanhmuc/quocgiavavunglanhtho/quocgiavavunglanhtho.service';
import { QuocgiavavunglanhthoDeleteDialogComponent } from '../delete/quocgiavavunglanhtho-delete.component';
import { AccountService } from 'app/core/auth/account.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'jhi-quocgiavavunglanhtho',
  templateUrl: './quocgiavavunglanhtho.component.html',
  styleUrls: ['./quocgiavavunglanhtho.component.scss', '../../quanlydanhmuc.component.scss']
})
export class QuocgiavavunglanhthoComponent implements OnInit {

  headers = ['STT', 'Mã quốc gia/ vùng lãnh thổ', 'Tên quốc gia', 'Tình trạng', 'Thao tác']


  currentAccount: Account | null = null;
  users: User[] | null = null;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  pageSize!: number;
  predicate!: string;
  ascending!: boolean;
  totalPages!: number;
  resultSearch: User[] | null = null;
  stt: number;
  currentPath: string;
  roles: string;
  checkAuth = false;
  fields = {
    maQG: '',
    ten: '',
  }

  filter = {}

  constructor(
    private userService: QuocgiavavunglanhthoService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private alert: AlertServiceCheck,
    private NavbarService: NavBarService,
    private sessionStorageService: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.page = params['page'];
      this.handleNavigation();
    })
    this.currentPath = this.router.url;
    this.NavbarService.getPath(this.currentPath);
    this.roles = this.sessionStorageService.retrieve('roles');
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i] == '09000') {
        this.checkAuth = true;
      }
    }

  }

  setActive(user: User, isActivated: boolean): void {
    this.userService.update({ ...user }).subscribe(() => this.loadAll());
  }

  trackIdentity(_index: number, item: User): any {
    // return item.stt!;
  }

  updateFilters() {
    const dk = sessionStorage.getItem('dktk')
    if (dk && dk !== "{}") {
      this.resultSearch = this.users;
      this.filter = JSON.parse(dk);
      this.fields = JSON.parse(dk);
      this.resultSearch = this.transform(this.resultSearch, this.filter);
      this.totalItems = Number(this.resultSearch.length)
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
    } else {
      Object.keys(this.fields).forEach((key) => {
        if (key !== 'tinhTrang') {
          this.fields[key] = this.fields[key].trim();
        }
      });
      Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
      this.resultSearch = this.users;
      this.filter = Object.assign({}, this.fields);
      this.resultSearch = this.transform(this.resultSearch, this.filter);
      this.totalItems = Number(this.resultSearch.length)
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    }
  }

  search() {
    sessionStorage.removeItem('dktk')
      Object.keys(this.fields).forEach(k => this.fields[k] = this.fields[k].trim());
      Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
      this.resultSearch = this.users;
      console.log(this.fields)
      this.filter = Object.assign({}, this.fields);
      this.resultSearch = this.transform(this.resultSearch, this.filter);
      this.totalItems = Number(this.resultSearch.length)
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage)
  }

  deleteUser(user: User): void {
    const modalRef = this.modalService.open(QuocgiavavunglanhthoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.user = user;
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
    this.userService
      .getAll({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<User[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers);
        },
        error: () => (this.isLoading = false),
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

  transform(items: Array<any>, filter: { [key: string]: any }): Array<any> {
    if (Object.keys(filter).length == 0) return items;
    let dk = JSON.stringify(this.filter);
    sessionStorage.setItem('dktk', dk)
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

  private onSuccess(users: User[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(users.length);
    this.users = users;
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage)
    this.updateFilters();
  }
}
