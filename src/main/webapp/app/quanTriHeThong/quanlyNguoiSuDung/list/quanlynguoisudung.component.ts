import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ASC, DESC, SORT } from 'app/config/navigation.constants';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { combineLatest } from 'rxjs';
import { Account } from 'app/core/auth/account.model';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { QuanLyNguoiSuDungDeleteDialogComponent } from '../delete/quanlynguoisudung-delete.component';
import { QuanLyNguoiSuDungService } from '../quanlynguoisudung.service';
import { User } from '../quanlynguoisudung.model';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { AccountService } from 'app/core/auth/account.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';

@Component({
  selector: 'jhi-quanlynguoisudung',
  templateUrl: './quanlynguoisudung.component.html',
  styleUrls: ['./quanlynguoisudung.component.scss', '../../quantrihethong.component.scss']
})
export class QuanLyNguoiSuDungComponent implements OnInit {

  headers = ['STT', 'Họ và tên', 'Tên tài khoản', 'Email', 'Ngày sinh', 'Giới tính', 'Chức vụ', 'Tình trạng', 'Thao tác']


  currentAccount: Account | null = null;
  users: User[] | null = null;
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  pageSize!: number;
  predicate!: string;
  ascending!: boolean;
  totalPages: number;
  resultSearch: User[] | null = null;
  success = false;
  error = false;
  maNhanVien: string;
  currentPath: string;
  dktk: string;
  
  constructor(
    private userService: QuanLyNguoiSuDungService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private alert: AlertServiceCheck,
    private accountService: AccountService,
    private NavbarService: NavBarService
  ) {   
   }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.page = params['page'];
      this.handleNavigation();
    })
    this.maNhanVien = this.accountService.getAccount().maNhanVien;
    this.currentPath = this.router.url;
    this.NavbarService.getPath(this.currentPath)
  }

  setActive(user: User, isActivated: boolean): void {
    this.userService.update({ ...user }).subscribe(() => this.loadAll());
  }

  trackIdentity(_index: number, item: User): any {
    // return item.ID!;
  }
  fields = {
    hoTen: '',
    maNhanVien: '',
    email: '',
    chucDanh: '',
    tinhTrang: null
  };
  filter = {}
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

  deleteUser(user: User): void {
    if (user.maNhanVien === this.maNhanVien) {
      this.alert.warn('Bạn không thể tự xóa chính mình')
    } else {
    const modalRef = this.modalService.open(QuanLyNguoiSuDungDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.user = user;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
        this.alert.success('Xóa thành công')
      }
    });
    }
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

  resetPassword(user: User): void {
    user.tinhTrang = true;
      this.userService.resetPassword(user).subscribe({
        next: () => this.onSaveSuccess(),
        error: response => this.onSaveError(response)
      })
    
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
    let filterKeys = Object.keys(filter);
    let dk = JSON.stringify(this.filter);
    
    return items.filter(item => {
      return filterKeys.every(keyName => {
        if (keyName === 'tinhTrang' && (filter[keyName] === null || filter[keyName] === 'null') ) {
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



  private handleNavigation(): void {
      const page = this.page;
      this.page = +(page ?? 1);
      this.loadAll();
    ;
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
    this.updateFilters()
  }

  private onSaveSuccess(): void {
    this.alert.success('Đổi mật khẩu thành công');
  }

  private onSaveError(response: HttpErrorResponse): void { 
    if (response.status !== 200) {
      this.alert.remove('Đổi mật khẩu không thành công');
    }
  }
  
}
