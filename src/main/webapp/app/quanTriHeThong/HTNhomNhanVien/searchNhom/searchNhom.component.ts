import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { AlertService } from 'app/core/util/alert.service';
import { User } from 'app/quanTriHeThong/HTNhom/HTNhom.model';
import { HTNhomService } from 'app/quanTriHeThong/HTNhom/HTNhom.service';

@Component({
  selector: 'jhi-modal-change-password',
  templateUrl: './searchNhom.component.html',
  styleUrls: ['../../quantrihethong.component.scss'],
})
export class SearchNhomComponent implements OnInit {

    headers = ['STT', 'Mã nhóm', 'Tên nhóm', 'Chọn']
    itemsPerPage = ITEMS_PER_PAGE;
    page!: number;
    tenNhom: string;
    maNhom: string;
    
    constructor(
        public modal: NgbActiveModal,
        private toast: AlertService,
        private userService: HTNhomService
        ) { }
        
        ngOnInit(): void {
            this.loadAll()
        }
        users: User[];
  
    loadAll(): void {
        this.userService.getAll().subscribe({
            next: (res: HttpResponse<User[]>) => {
                this.onSuccess(res.body, res.headers);
              },
        })
    }
    
    getTen(user: User): void {
        this.tenNhom = user.ten;
        this.maNhom = user.maNhom;
        this.close()
    }

    save() { }
    
    close() {
        this.modal.close({tenNhom: this.tenNhom, maNhom: this.maNhom});
  }

  dismiss() {
    this.modal.dismiss();
    }
    
    private onSuccess(users: User[] | null, headers: HttpHeaders): void {
        this.users = users;
    }
    
}
