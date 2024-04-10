import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';

import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'jhi-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('username', { static: false }) username!: ElementRef;

  fieldTextType: boolean = false;

  authenticationError = false;
  isLoading = false;
  warningMessage = false;
  checkUsename = false;
  checkPass = false;



  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
  });

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private router: Router,
    private alert: AlertServiceCheck,
    private sessionStorageService: SessionStorageService,
    private toast: AlertService
  ) {
    if (this.router.getCurrentNavigation()?.extras.state != null || this.router.getCurrentNavigation()?.extras.state != undefined) {
      const navigation = this.router.getCurrentNavigation().extras.state.data;
      if (navigation == 'Đổi mật khẩu thành công') {
        this.alert.success(String(navigation));
      }
    }
  }

  ngOnInit(): void {
    // if already authenticated then navigate to home page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate(['']);
      }
    });

    this.accountService.getAccount()
  }

  ngAfterViewInit(): void {
    if (this.username) {
      this.username.nativeElement.focus();
    }
  }

  login(): void {
    this.checkPass = false;
    this.checkUsename = false;
    this.warningMessage = false;
    this.authenticationError = false;
    const { username, password } = this.loginForm.getRawValue();
    if (username == '') {
      this.checkUsename = true;
      this.alert.error('Tài khoản không được để trống');
    } else if (password == '') {
      this.checkPass = true;
      this.alert.error('Mật khẩu không được để trống');
    } else {
      this.checkPass = false;
      this.loginService.login(this.loginForm.getRawValue()).subscribe({
        next: () => {
          this.authenticationError = false;
          //let messageLogin: string = this.sessionStorageService.retrieve('messageLogin');
          // if (this.accountService.isAuthenticated() && !this.router.getCurrentNavigation()) {
          if (this.accountService.isAuthenticated()) {
            // There were no routing during login (eg from navigationToStoredUrl)
            let isFirstLogin: string = this.sessionStorageService.retrieve('isFirstLogin');
            if (String(isFirstLogin) == 'true') {
              this.router.navigate(['/loginFT']);
            } else {
              //this.toast.addAlert({ message: 'Đăng nhập thành công', type: 'success', toast: true, timeout: 1000 });
              //this.alert.success('Đăng nhập thành công');
              const navigationExtras: NavigationExtras = { state: { data: 'Đăng nhập thành công' } };
              this.router.navigate([''], navigationExtras);

              //console.log(this.accountService.getAccount().tinhTrang)
            }
          } else {
            this.warningMessage = true;
            this.alert.error('Sai tài khoản hoặc mật khẩu');
            this.isLoading = false;
          }
        },
        error: () => {
          this.authenticationError = true;
          this.alert.error('Tài khoản này chưa tồn tài');
          this.isLoading = false
        },
      });
    }
  }

  closeWindow() {
    window.history.go(-(window.history.length - 1));
  }
}
