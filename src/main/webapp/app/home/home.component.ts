import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { LoginService } from 'app/login/login.service';
declare var $: any;
@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  checkLogin = false;
  isNavbarCollapsed = true;

  private readonly destroy$ = new Subject<void>();

  constructor(private accountService: AccountService, private router: Router, private alert: AlertServiceCheck, private loginService: LoginService,) {
    if (this.router.getCurrentNavigation()?.extras.state != null || this.router.getCurrentNavigation()?.extras.state != undefined) {
      this.checkLogin = true;
      if (this.checkLogin == true) {
        const navigation = this.router.getCurrentNavigation().extras.state.data;
        if (navigation == 'Đăng nhập thành công') {
          this.alert.success(String(navigation));
          this.checkLogin = false;
        }
      }
    }
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    window.onpopstate = function () {
      this.collapseNavbar();
      this.loginService.logout();
    }
    this.collapseNavbar();
    this.loginService.logout();
    history.pushState({}, '');
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }



  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));


  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
