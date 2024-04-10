import { Component, ViewChild, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginFT } from 'app/loginFirstTime/loginFT.model';
import { LoginService } from 'app/login/login.service';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';
import { clearSession } from 'app/shared/util/func-util';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';

@Component({
    selector: 'jhi-login',
    templateUrl: './loginFT.component.html',
    styleUrls: ['./loginFT.component.scss'],
})
export class LoginFTComponent implements OnInit, AfterViewInit {
    @ViewChild('username', { static: false }) username!: ElementRef;

    fieldTextType: boolean = false;

    fieldTextType_cf: boolean = false;

    isLoading = false;
    user: LoginFT;
    isNavbarCollapsed = true;

    doNotMatch = false;
    CheckPass = false;
    CheckNullPass = false;
    CheckNullCofPass = false;
    maNhanVienEX = this.accountService.getAccount().maNhanVien;
    idNv = this.accountService.getAccount().id;
    passNv = atob(this.accountService.getAccount().matKhau);

    loginFtForm = new FormGroup({
        maNhanVien: new FormControl(this.maNhanVienEX, { nonNullable: true, validators: [Validators.required] }),
        matKhau: new FormControl(this.passNv, { nonNullable: true, validators: [Validators.required] }),
        matKhauMoi: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        confirmMauKhau: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
        id: new FormControl(this.idNv, { nonNullable: true, validators: [Validators.required] }),
    });

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

    constructor(
        private accountService: AccountService,
        private loginService: LoginService,
        private router: Router,
        private toast: AlertService,
        private alert: AlertServiceCheck,
    ) { }

    ngOnInit(): void {
        // if already authenticated then navigate to home page
        // this.accountService.identity().subscribe(() => {
        //   if (this.accountService.isAuthenticated()) {
        //     this.router.navigate(['']);
        //   }
        // });
    }

    ngAfterViewInit(): void {
        if (this.username) {
            this.username.nativeElement.focus();
        }
    }

    ChangePassFT(): void {
        this.doNotMatch = false;
        this.CheckPass = false;
        this.CheckNullPass = false;
        this.CheckNullCofPass = false;
        const { matKhauMoi, confirmMauKhau } = this.loginFtForm.getRawValue();
        if (matKhauMoi == '') {
            this.CheckNullPass = true;
            this.alert.error('Mật khẩu không được để trống');
        } else if (confirmMauKhau == '') {
            this.CheckNullCofPass = true;
            this.alert.error('Xác nhận mật khẩu không được để trống');
        } else if (String(matKhauMoi.trim()) == '123456') {
            this.CheckPass = true;
            this.alert.error('Mật khẩu không được giống với mật khẩu mặc định');
        } else if (matKhauMoi.trim().length < 6) {
            this.alert.error('Mật khẩu mới bắt buộc nhập tối thiểu 6 ký tự');
        } else if (matKhauMoi.trim() !== confirmMauKhau.trim()) {
            this.doNotMatch = true;
            this.alert.error('Mật khẩu không trùng khớp');
        } else {
            const user = this.loginFtForm.getRawValue();
            this.loginService.UpdatePassFt(user).subscribe({
                next: () => { this.changePassSuccess() },
                error: () => { this.changePassError() },
            });
        }

    }

    changePassSuccess() {
        this.collapseNavbar();
        this.loginService.logoutAfterChangePass();
        this.alert.success('Đổi mật khẩu thành công');
    }

    logout(): void {
        this.collapseNavbar();
        this.loginService.logout();
    }

    changePassError() {
        this.alert.error('Đổi mật khẩu không thành công');
        this.isLoading = false
    }

    collapseNavbar(): void {
        this.isNavbarCollapsed = true;
    }

    isHidden: boolean = false;
    showDiv() {
        this.isHidden = false;   // Show the div
    }
    hideDiv() {
        this.isHidden = true;  //  Hide the div
    }
}
