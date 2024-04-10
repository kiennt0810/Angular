import { Component, OnInit, RendererFactory2, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRouteSnapshot, NavigationEnd, NavigationError } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { clearSession, isNullOrUndefined } from 'app/shared/util/func-util';

import { AccountService } from 'app/core/auth/account.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { SESSION_TIMEOUT } from 'app/app.constants';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  isShowSideBar = true;
  private renderer: Renderer2;

  constructor(
    private bnIdle: BnNgIdleService,
    private accountService: AccountService,
    private titleService: Title,
    private router: Router,
    private translateService: TranslateService,
    rootRenderer: RendererFactory2
  ) {
    // this.router.navigate(['/login']);
    // window.addEventListener('storage', (event) => {
    //   if (event.storageArea != localStorage) return;
    //   if (event.key === 'full_name') {
    //     if (localStorage.getItem('full_name')) {

    //     } else {

    //     }
    //   }
    // });
    this.renderer = rootRenderer.createRenderer(document.querySelector('html'), null);

    this.bnIdle.startWatching(SESSION_TIMEOUT).subscribe((res) => {
      if(res) {
          console.log("session expired");
          clearSession();
          this.accountService.authenticate(null);
          this.router.navigate(['/login']);
      }
    })
  }

  ngOnInit(): void {
    // try to log in automatically
    // this.accountService.identity().subscribe();

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.updateTitle();
    //   }
    //   if (event instanceof NavigationError && event.error.status === 404) {
    //     this.router.navigate(['/404']);
    //   }
    // });

    // this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
    //   this.updateTitle();
    //   dayjs.locale(langChangeEvent.lang);
    //   this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    // });
  }

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
    let title: string = routeSnapshot.data['pageTitle'] ?? '';
    if (routeSnapshot.firstChild) {
      title = this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

  private updateTitle(): void {
    let pageTitle = this.getPageTitle(this.router.routerState.snapshot.root);
    if (!pageTitle) {
      pageTitle = 'global.title';
    }
    this.translateService.get(pageTitle).subscribe(title => this.titleService.setTitle(title));
  }

  _isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
    // return true;
  }

  _noPaddingContent(): boolean {
    return (
      this.router.routerState.snapshot.url.includes('/login') ||
      this.router.routerState.snapshot.url.includes('/register') ||
      this.router.routerState.snapshot.url.includes('/loginFT') ||
      this.router.routerState.snapshot.url.includes('/fb')
    );
  }

  displayNavbar(): boolean {
    return this._isAuthenticated() && (!this.router.routerState.snapshot.url.includes('/fb') && !this.router.routerState.snapshot.url.includes('/loginFT'));
    // return this._isAuthenticated();
  }

  displaySidebar() {
    return (!this.router.routerState.snapshot.url.includes('/fb') && !this.router.routerState.snapshot.url.includes('/loginFT'));
  }

  handleSideBarAction(action: boolean): void {
    this.isShowSideBar = action;
    return;
  }
}
