import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  AfterContentInit,
} from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { MENU } from './side-bar.constants';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { isNullOrUndefined } from 'app/shared/util';
import { NavBarService } from '../navbar/nav-bar.service';

@Component({
  selector: 'jhi-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  
})
export class SideBarComponent implements OnInit, AfterViewChecked, AfterViewInit, AfterContentInit {
  @Output() sideBarAction: EventEmitter<any> = new EventEmitter<any>();
  isLoading = true;
  isShowSideBar = true;
  // menu: any[] = MENU;
  menu: any[];
  activedLeaf = null;
  parentPath: any

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    protected router: Router,
    private cdRef: ChangeDetectorRef,
    private navbarService: NavBarService
  ) {
    this.menu = MENU;
    this.findLeaf(this.menu, this.router.url);
  }

  ngOnInit(): void {
    // check path4
  }

  ngAfterViewChecked() {
    // this.cdRef.detectChanges();
  }

  ngAfterContentInit() {
    this.isLoading = false;
  }
  ngAfterViewInit() {
    if (!isNullOrUndefined(this.activedLeaf)) {
      this.menu = this.onLeafChange(this.menu, this.activedLeaf);
    }
    this.cdRef.detectChanges();
    // this.isLoading = false;
  }

  onClickMenu(event: any, leaf: any): void {
    event.stopPropagation();
    this.menu = this.onLeafChange(this.menu, leaf);
    // this.cdRef.detectChanges();
    // this.onAfterExpanded(leaf);
  }


  onAfterExpanded(leaf: any) {
    const menu = this.menu.map(m => {
      if (leaf.parentId !== m.id && m.id !== leaf.id) {
        m.active = false;
      }
      return m;
    });
    this.menu = [...menu];
    // this.cdRef.detectChanges();
  }

  isActive(leaf: any): boolean {
    // return this.isPathMatching(this.activedLeaf, leaf);
    return !isNullOrUndefined(this.activedLeaf) && this.activedLeaf.id === leaf.id;
  }

  isPathMatching(root: any, leaf: any) {
    // return !isNullOrUndefined(this.activedLeaf) && this.activedLeaf.id === leaf.id;
    if (!isNullOrUndefined(root)) {
      if (leaf.path === this.router.url) {
        return true;
      } else {
        if (!isNullOrUndefined(root.leaves) && root.leaves.length > 0) {
          const checklist = [];
          root.leaves.forEach(fe => {
            if (this.isPathMatching(fe, leaf)) {
              checklist.push(true);
            }
          });
          return checklist.length > 0;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }

  resetDktk() {
    sessionStorage.removeItem('dktk');
  }

  findLeaf(leaves: any[], path: string) {
    if (!isNullOrUndefined(path) && path !== '/') {
      this.onReadAllLeaf(leaves, path);
    } else {
      this.activedLeaf = null;
    }
  }


  
  onReadAllLeaf(leaves: any[], path: string) {
    leaves.find(f => {
      if (f.path === path) {
        this.activedLeaf = f;
      } else {
        if (!isNullOrUndefined(f.leaves) && f.leaves.length > 0) {
          this.onReadAllLeaf(f.leaves, path);
        }
      }
    });
  }

  onLeafChange(leaves: any[], leaf: any, force?: boolean) {
    return leaves.map(m => {
      if (m.id === leaf.id) {
        m.active = !m.active;
      } else {
        m.active = false;
        if (!isNullOrUndefined(m.leaves) && m.leaves.length > 0) {
          m.leaves = this.onLeafChange(m.leaves, leaf);
        }
      }
      return m;
    });
  }

  _isLeaf(leaves: any[]): boolean {
    return leaves !== null && leaves !== undefined && leaves.length > 0;
  }

  _isNullOrUndefined(value: any) {
    return isNullOrUndefined(value);
  }

  _isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
    // return true;
  }

  showSideBar(): void {
    this.isShowSideBar = !this.isShowSideBar;
    this.sideBarAction.emit(this.isShowSideBar);
  }
}
