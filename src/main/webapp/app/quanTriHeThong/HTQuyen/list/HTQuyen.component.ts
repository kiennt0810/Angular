import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Account } from 'app/core/auth/account.model';
import { HTQuyenService } from '../HTQuyen.service';
import { User } from '../HTQuyen.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { HTNhomService } from 'app/quanTriHeThong/HTNhom/HTNhom.service';
import { SearchNhomComponent } from 'app/quanTriHeThong/HTNhomNhanVien/searchNhom/searchNhom.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AlertService } from 'app/core/util/alert.service';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertModuleCheck } from 'app/alertNew/alertNew.module';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';


@Component({
    selector: 'jhi-HTQuyen',
    templateUrl: './HTQuyen.component.html',
    styleUrls: ['../../quantrihethong.component.scss', './HTQuyen.component.scss'],
    standalone: true,
    imports: [
        MatTableModule,
        FormsModule,
        MatCheckboxModule,
        MatSortModule,
        RouterModule,
        CommonModule, AlertModuleCheck],
})
export class HTQuyenComponent implements OnInit {

    displayedColumns:string[] = ['idCn', 'tenCN', 'select'];

    currentAccount: Account | null = null;
    isLoading = false;
    totalItems1 = 0;
    totalItems2 = 0;
    usersTable1: User[] | null = null;
    usersTable2: User[] | null = null;
    highlightItem1: User[] | null = [];
    highlightItem2: User[] | null = [];
    isSaving = false;
    showTable = false;
    tenNhom: string | null;
    idNhom: number | null;
    user: User[] | null;
    showNotice = false;
    dataSource1: any;
    dataSource2: any;
    currentPath: string;
  
    constructor(
        private userService: HTQuyenService,
        private htNhomService: HTNhomService,
        private modalService: NgbModal,
        private alert: AlertServiceCheck,
        private NavbarService: NavBarService,
        private _liveAnnouncer: LiveAnnouncer,
        private router: Router
    ) { }

    @ViewChild('table1', { read: MatSort, static: true}) sort1: MatSort;
    @ViewChild('table2', { read: MatSort, static: true}) sort2: MatSort;

    ngOnInit(): void {
        this.currentPath = this.router.url;
      this.NavbarService.getPath(this.currentPath);
    }

    fields = {
        maNhom: '',
    };
    filter = {}
    updateFilters() {
        Object.keys(this.fields).forEach(k => this.fields[k] = this.fields[k].trim());
        Object.keys(this.fields).forEach(key => this.fields[key] === '' ? delete this.fields[key] : key);
        this.filter = Object.assign({}, this.fields);
        this.tenNhom = null;
        if (this.fields.maNhom) {
            this.getTen()
        } else {
            this.showTable = false
        }
    }

    getTen(): void {
        this.htNhomService.getTen(this.fields.maNhom).subscribe((res: any) => {
            if (res) {
                this.tenNhom = res.ten;
                this.loadTable1()
                this.loadTable2()
                this.showTable = true;
                this.showNotice = false;
                this.idNhom = res.id;
            }
            else {
                this.tenNhom = null;
                this.showTable = false;
                this.showNotice = true
           }
        })
    }

    openSearchNhomBox() {
        const dialogRef = this.modalService.open(SearchNhomComponent, {
          size: 'lg',
          centered: true,
        });
        dialogRef.result.then(
          result => {
                this.tenNhom = result.tenNhom;
                this.fields.maNhom = result.maNhom
                this.updateFilters()

          },
          reason => {
            console.log('Dismissed');
          }
        );
    }
    
    sortTable1(): void { if (this.sort1) {
        this.dataSource1 = new MatTableDataSource(this.usersTable1)
        this.dataSource1.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
            if (typeof data[sortHeaderId] === 'string') {
                const collator = new Intl.Collator('vi', { sensitivity: 'base' });
                return data[sortHeaderId].toLocaleLowerCase('vi').replace(/đ/g, 'd') // Handle 'đ' character
            }
          
            return data[sortHeaderId];
          };
        this.dataSource1.sort = this.sort1
    }
}
    sortChange1(sortState: Sort) {
        // if (sortState.direction) {
        //   this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        // } else {
        //   this._liveAnnouncer.announce('Sorting cleared');
        // }
      }

    sortTable2(): void { 
        if (this.sort2) {
            this.dataSource2 = new MatTableDataSource(this.usersTable2)
            this.dataSource2.sortingDataAccessor = (data: any, sortHeaderId: string): string => {
                if (typeof data[sortHeaderId] === 'string') {
                    const collator = new Intl.Collator('vi', { sensitivity: 'base' });
                    return data[sortHeaderId].toLocaleLowerCase('vi').replace(/đ/g, 'd') // Handle 'đ' character
                }
              
                return data[sortHeaderId];
              };
            this.dataSource2.sort = this.sort2
        }
    }
    sortChange2(sortState2: Sort) {
        // if (sortState2.direction) {
        //   this._liveAnnouncer.announce(`Sorted ${sortState2.direction}ending`);
        // } else {
        //   this._liveAnnouncer.announce('Sorting cleared');
        // }
    }

    loadTable1(): void {
        this.userService.getTable1(this.fields.maNhom).subscribe((res: any) => {
            this.usersTable1 = res;
            this.totalItems1 = this.usersTable1.length;
            this.sortTable1();
        })
    }
    loadTable2(): void {
        this.userService.getTable2(this.fields.maNhom).subscribe((res: any) => {
            this.usersTable2 = res;
            this.totalItems2 = this.usersTable2.length;
            if (this.usersTable2.length > 0) {
                this.idNhom = this.usersTable2[0].idNhom;
            }
            this.sortTable2();
        })
    }

    selection1 = new SelectionModel<Element>(true, []);

    isAllSelected1() {
        const numSelected = this.selection1.selected.length;
        const numRows = this.usersTable1.length;
        return numSelected === numRows;
    }

    masterToggle1() {
        this.isAllSelected1() ?
        this.selection1.clear() :
        this.usersTable1.forEach((row: Element) => this.selection1.select(row));
    }
    
    selection2 = new SelectionModel<Element>(true, []);
    isAllSelected2() {
        const numSelected = this.selection2.selected.length;
        const numRows = this.usersTable2.length;
        return numSelected === numRows;
    }

    masterToggle2() {
        this.isAllSelected2() ?
        this.selection2.clear() :
        this.usersTable2.forEach((row: Element) => this.selection2.select(row));
    }

    moveToSecondTable() {
        this.highlightItem1 = [...this.selection1.selected, ...this.highlightItem1];
        if (this.highlightItem1.length > 0) {
            this.highlightItem1.forEach(user => {
                user.createdBy = JSON.parse(sessionStorage.getItem('jhi-userName'))
            })
        }
        this.usersTable2 = [...this.selection1.selected, ...this.usersTable2];
        this.usersTable1 = this.usersTable1.filter(x => !this.selection1.selected.includes(x))
        this.selection1 = new SelectionModel<Element>(true, []);
        this.dataSource2 = new MatTableDataSource(this.usersTable2);
        this.dataSource1 = new MatTableDataSource(this.usersTable1);
        this.sortTable1();
        this.sortTable2();
    }
    moveToFirstTable() {
        this.highlightItem2 = [...this.selection2.selected, ...this.highlightItem2];
        this.usersTable1 = [...this.selection2.selected, ...this.usersTable1];
        this.usersTable2 = this.usersTable2.filter(x => !this.selection2.selected.includes(x))
        this.selection2 = new SelectionModel<Element>(true, []);
        this.dataSource2 = new MatTableDataSource(this.usersTable2);
        this.dataSource1 = new MatTableDataSource(this.usersTable1);
        this.sortTable1();
        this.sortTable2();
    }

   
    save(): void {
            this.user = this.usersTable2.map(user => {
            user.idNhom = this.idNhom;
            return user;
            })
        this.userService.create(this.user, this.idNhom).subscribe({
            next: () => this.onSaveSuccess(),
            error:response => this.onSaveError(response),
          });
    }

  

    private onSaveSuccess(): void {
        this.isSaving = false;
        this.updateFilters();
        this.alert.success('Phân quyền thành công');       }
    
    private onSaveError(response: HttpErrorResponse): void {
        this.isSaving = false;
        if (response.status !== 200) {
            this.alert.error('Phân quyền không thành công');
        }
    }

}

export interface Element {
  idNhom: number;
  idCn: string;
  maNhom: string;
  tenCN: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdDate: string | null;
  updatedDate: string | null;
}