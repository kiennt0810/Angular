import { Component, OnInit, Compiler, Injector, NgModuleFactory, Type, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/config/language.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import { MENU } from '../side-bar/side-bar.constants';
import { NavBarService } from './nav-bar.service';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: any[] = [];
  currentPath: string;
  parentPath: string;
  parentName: string;
  childPath: string;
  childName: string;
  subPath: string;
  subName: string;

  nameModule = '';
  link = '';

  constructor(
    private loginService: LoginService,
    private translateService: TranslateService,
    private sessionStorageService: SessionStorageService,
    private compiler: Compiler,
    private injector: Injector,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router,
    private navbarService: NavBarService,
    private cdRef:ChangeDetectorRef
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
    // if (this.router.getCurrentNavigation()?.extras.state != null || this.router.getCurrentNavigation()?.extras.state != undefined) {
    //   const navigation = this.router.getCurrentNavigation().extras.state.data;
    //   if (navigation == 'Home' && this.router.url === '') {
    //     this.parentName = null;
    //     this.childName = null;
    //     sessionStorage.removeItem('parentName');
    //     sessionStorage.removeItem('childName');
    //   }
    // }
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    // this.profileService.getProfileInfo().subscribe(profileInfo => {
    //   this.inProduction = profileInfo.inProduction;
    //   this.openAPIEnabled = profileInfo.openAPIEnabled;
    // });
    this.navbarService.getCurrentPath.subscribe((item: string) => {
      if (item) {
        this.currentPath = item;
        this.subName = null;
        const indexOfSecondSlash = this.currentPath.indexOf('/', 1)
        if (indexOfSecondSlash >= 0) {
          this.parentPath = this.currentPath.substring(0, indexOfSecondSlash)
        } else {
          this.parentPath = this.currentPath;
        }

        const items = MENU.find(item => (item.path === this.parentPath))
        if (items) {
          sessionStorage.setItem('parentName', items.name)
          sessionStorage.setItem('parentPath', items.path)
          this.parentName = sessionStorage.getItem('parentName')
          this.parentPath = sessionStorage.getItem('parentPath')
          if (items.leaves) {
            const childItems = items.leaves.find(childItem => (childItem.path === this.currentPath))
            if (childItems) {
              sessionStorage.setItem('childName', childItems.name)
              sessionStorage.setItem('childPath', childItems.path)
              this.childName = sessionStorage.getItem('childName')
              this.childPath = sessionStorage.getItem('childPath')
            } else {
              sessionStorage.removeItem('childName')
              this.childName = null;
            }
          } else {
            sessionStorage.removeItem('childName')
            this.childName = null;
          }
        }
        this.cdRef.detectChanges();
      }
    })

    this.navbarService.setSubPath.subscribe((item) => {
      if (item) {
        this.subPath = item;
        this.parentName = sessionStorage.getItem('parentName');
        this.parentPath = sessionStorage.getItem('parentPath');
        this.childName = sessionStorage.getItem('childName');
        this.childPath = sessionStorage.getItem('childPath');
        this.cdRef.detectChanges();
      }
    })

    this.navbarService.setSubName.subscribe((item) => {
      if (item) {
        this.subName = item;
        this.cdRef.detectChanges();
      }
    })

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
  }

  loadingParent() {
    if (!this.childPath) {
      this.router.navigate([`${this.parentPath}`])
    }
  }

  loadingChild() {
    this.router.navigate([`${this.childPath}`])
    this.subName = null;
  }

  loadingSub() {
    this.router.navigate([`${this.subPath}`])
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  home(): void {
    this.router.navigate(['']);
    this.childName = null;
    this.parentName = null;
    this.subName = null;
  }

  redirectTo() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([''])
    });
  }
  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    // this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  private loadModule(moduleType: Type<any>): void {
    const moduleFactory = this.compiler.compileModuleAndAllComponentsSync(moduleType);
    moduleFactory.ngModuleFactory.create(this.injector);
  }
  changePass() {
    this.router.navigate(['/quantrihethong/ChangePassword']);
  }

}
