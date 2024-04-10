import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { Login } from './login.model';
import { API_URL } from 'app/app.constants';
import { LoginFT } from 'app/loginFirstTime/loginFT.model';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class LoginService {

  private resourceUrl = API_URL + '/api/HTNhanVien';

  constructor(private accountService: AccountService, 
    private authServerProvider: AuthServerProvider, 
    private http: HttpClient, 
    private applicationConfigService: ApplicationConfigService) {}

  login(credentials: Login): Observable<Account | null> {
    return this.authServerProvider.login(credentials).pipe(mergeMap(() => this.accountService.identity(true)));
  }

  logout(): void {
    // this.authServerProvider.logout().subscribe({ complete: () => this.accountService.authenticate(null) });
    this.authServerProvider.logout();
  }

  logoutAfterChangePass(): void {
    // this.authServerProvider.logout().subscribe({ complete: () => this.accountService.authenticate(null) });
    this.authServerProvider.logoutAfterChangePass();
  }

  logoutDirectly() {
    this.accountService.authenticate(null);
  }

  UpdatePassFt(user: LoginFT): Observable<LoginFT> {
    return this.http.post<LoginFT>(`${this.resourceUrl}/UpdatePwd`, user);
  }
}
