import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { LoginService } from 'app/login/login.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { AccountService } from 'app/core/auth/account.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {
  constructor(
    private loginService: LoginService,
    private stateStorageService: StateStorageService,
    private router: Router,
    private accountService: AccountService,
    private ngModal: NgbModal
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          console.log(err);
          if (err.status === 401 && err.url && !err.url.includes('api/HTNhanvien') && this.accountService.isAuthenticated()) {
            this.stateStorageService.storeUrl(this.router.routerState.snapshot.url);
            this.loginService.logoutDirectly();
            this.ngModal.dismissAll();
            this.router.navigate(['/login']);
          }
        },
      })
    );
  }
}
