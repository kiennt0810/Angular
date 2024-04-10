import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ApplicationConfigService } from '../config/application-config.service';
import { Account } from 'app/core/auth/account.model';
import { API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: Account | null = null;
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account> | null;

  constructor(
    private translateService: TranslateService,
    private sessionStorageService: SessionStorageService,
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private router: Router,
    private applicationConfigService: ApplicationConfigService
  ) {}

  save(account: Account): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('services/uaa/api/account'), account);
  }

  authenticate(identity: Account | null): void {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
    if (!identity) {
      this.accountCache$ = null;
    }
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    let userRoles: string[] = this.sessionStorageService.retrieve('roles');

    return userRoles.some((authority: string) => authorities.includes(authority));
  }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force) {
      this.accountCache$ = this.fetch().pipe(
        tap((account: Account) => {
          account.login = account.maNhanVien;
          this.authenticate(account);
          // After retrieve the account info, the language will be changed to
          // the user's preferred language configured in the account setting
          // unless user have choosed other language in the current session
          // if (!this.sessionStorageService.retrieve('locale')) {
          //   this.translateService.use(account.langKey);
          // }

          this.navigateToStoredUrl();
        }),
        shareReplay()
      );
    }
    return this.accountCache$.pipe(catchError(() => of(null)));    
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
    // return true;
  }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  private fetch(): Observable<Account> {
    const token: string | null = this.sessionStorageService.retrieve('authenticationToken');
    var url = API_URL + '/api/Staff/';


    if(token){
      let userID = this.sessionStorageService.retrieve('userID');     
      url = url + userID;      
    } 
    else url = url + '0';    
    return this.http.get<Account>(url);
    // return;
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }

  getAccount(): Account | null {
    return this.userIdentity !== undefined ? this.userIdentity : null;
  }
}
