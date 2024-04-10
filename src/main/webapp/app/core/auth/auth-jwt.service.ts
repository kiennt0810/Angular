import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { ApplicationConfigService } from '../config/application-config.service';
import { Login } from 'app/login/login.model';
import { AccountService } from './account.service';
import { clearSession, isNullOrUndefined } from 'app/shared/util/func-util';
import { NavigationExtras, Router } from '@angular/router';
import { API_URL } from 'app/app.constants';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';

type JwtToken = {
  data: string;
  role: string;
  isFirstLogin: string;
  message: string;
};

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private applicationConfigService: ApplicationConfigService,
    private accountService: AccountService,
    private router: Router,
    private alert: AlertServiceCheck,
  ) { }

  getToken(): string {
    const tokenInLocalStorage: string | null = this.localStorageService.retrieve('authenticationToken');
    const tokenInSessionStorage: string | null = this.sessionStorageService.retrieve('authenticationToken');
    return tokenInLocalStorage ?? tokenInSessionStorage ?? '';
  }

  login(credentials: Login): Observable<void> {
    return this.http
      .post<JwtToken>(API_URL + '/api/Staff/Login', credentials)
      .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe)));
  }

  logout(navigate?: boolean): void {
    if (this.accountService.isAuthenticated()) {
      if (isNullOrUndefined(navigate) || (!isNullOrUndefined(navigate) && navigate)) {
        this.router.navigate(['/login']);
      }
      this.sessionStorageService.clear();
      this.accountService.authenticate(null);
    } else {
      this.accountService.authenticate(null);
    }
  }

  logoutAfterChangePass(navigate?: boolean): void {
    if (this.accountService.isAuthenticated()) {
      if (isNullOrUndefined(navigate) || (!isNullOrUndefined(navigate) && navigate)) {
        const navigationExtras: NavigationExtras = {state: {data: 'Đổi mật khẩu thành công'}};
        this.router.navigate(['/login'], navigationExtras);
      }
      this.sessionStorageService.clear();
      this.accountService.authenticate(null);
    } else {
      this.accountService.authenticate(null);
    }
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    const jwt = response.data;
    if (jwt) {
      let jwtdata = jwt.split('.')[1];
      let decodedjwtjsondata = window.atob(jwtdata);
      let decodedjwtdata = JSON.parse(decodedjwtjsondata);
      this.sessionStorageService.store('userID', decodedjwtdata['Id']);
      this.sessionStorageService.store('userName', decodedjwtdata['UserName']);
      this.sessionStorageService.store('roles', response.role);
      this.sessionStorageService.store('ThoiHanHC', decodedjwtdata['ThoiHanHC']);
    }
    if (rememberMe) {
      this.localStorageService.store('authenticationToken', jwt);
      this.sessionStorageService.clear('authenticationToken');
    } else {
      this.sessionStorageService.store('authenticationToken', jwt);
      this.localStorageService.clear('authenticationToken');
    }
    if (String(response.isFirstLogin) == 'true') {
      this.sessionStorageService.store('isFirstLogin', response.isFirstLogin);
      //this.router.navigate(['/loginFT']);
    } else {
      this.sessionStorageService.store('isFirstLogin', response.isFirstLogin);
    }
    if (String(response.message) != '') {
      this.sessionStorageService.store('messageLogin', response.message);
    }
  }
}
