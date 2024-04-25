import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ProductService } from '../product.service';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent, FocusEvent, BlurEvent } from '@ckeditor/ckeditor5-angular';
import { Brand } from 'app/quanlydanhmuc/Brand/Brand.model';
import { BrandService } from 'app/quanlydanhmuc/Brand/Brand.service';
import { Color } from 'app/quanlydanhmuc/Color/Color.model';
import { ColorService } from 'app/quanlydanhmuc/Color/Color.service';
import { Storage } from 'app/quanlydanhmuc/Storage/Storage.model';
import { StorageService } from 'app/quanlydanhmuc/Storage/Storage.service';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
    selector: 'jhi-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.scss']
})
export class ProductUpdateComponent implements OnInit {
    isSaving = false;
    currentPath: string;
    brands: Brand[] | null = null;
    colors: Color[] | null = null;
    storages: Storage[] | null = null;

    toggleDisableEditors() {
        this.isDisabled = !this.isDisabled;
      }
    
      onChange(event: ChangeEvent): void {
        this.componentEvents.push('Editor model changed.');
        this.editorData = event.editor.getData();
      }
    
      onFocus(event: FocusEvent): void {
        this.componentEvents.push('Focused the editing view.');
      }
    
      onBlur(event: BlurEvent): void {
        this.componentEvents.push('Blurred the editing view.');
      }


    editForm = new FormGroup({
        id: new FormControl(),
        tenSp: new FormControl(),
        soLuong: new FormControl(),
        giaThanh: new FormControl(),
        moTa: new FormControl(),
        idBrand: new FormControl(),
        idStorage: new FormControl(),
        idColor: new FormControl(),
        createdBy: new FormControl()
    });

    public Editor = ClassicEditor;
    public componentEvents: string[] = [];
    public isDisabled = false;
    public editorData = ``;

    

    constructor(
        private Service: ProductService,
        private route: ActivatedRoute,
        private router: Router,
        private alert: AlertServiceCheck,
        private navbarService: NavBarService,
        private BrandService: BrandService,
        private ColorService: ColorService,
        private StorageService: StorageService,
        private sessionStorageService: SessionStorageService,
    ) { }

    ngOnInit(): void {
        this.currentPath = this.router.url;
        this.navbarService.getSubPath(this.currentPath, 'Sửa')
        const id = this.route.snapshot.params.ProductId;
        this.Service.getCurrentData(id).subscribe((result) => {
            this.editForm = new FormGroup({
                id: new FormControl(result['id']),
                tenSp: new FormControl(result['tenSp']),
                soLuong: new FormControl(result['soLuong']),
                giaThanh: new FormControl(result['giaThanh']),
                moTa: new FormControl(result['moTa']),
                idBrand: new FormControl(result['idBrand']),
                idStorage: new FormControl(result['idStorage']),
                idColor: new FormControl(result['idColor']),
                createdBy: new FormControl(result['createdBy'])
            })
            this.editorData = result['moTa'];
        });
        this.loadAllBrand();
        this.loadAllColor();
        this.loadAllStorage();
    }

    previousState(): void {
        window.history.back();
    }

    save(): void {
        this.isSaving = true;
        const product = this.editForm.getRawValue();
        let userName: string = this.sessionStorageService.retrieve('userName');
        product.createdBy = userName;
        product.moTa = this.editorData.toString();
        if (product.id !== null) {
            this.Service.update(product).subscribe({
                next: () => this.onSaveSuccess(),
                error: response => this.onSaveError(response),
            });
        }
    }

    private onSaveSuccess(): void {
        this.isSaving = false;
        this.previousState();
        this.alert.success('Sửa thành công');
    }

    private onSaveError(response: HttpErrorResponse): void {
        this.isSaving = false;
        if (response.status !== 200) {
            this.alert.error('Sửa không thành công');
        }
    }
    loadAllBrand(): void {
        this.BrandService.getLstBrand().subscribe({
          next: (res: HttpResponse<Brand[]>) => {
            this.onSuccessLstBrand(res.body);
          }
        });
      }
      private onSuccessLstBrand(brand: Brand[] | null): void {
        this.brands = brand;
      }
    
      loadAllColor(): void {
        this.ColorService.getLstColor().subscribe({
          next: (res: HttpResponse<Color[]>) => {
            this.onSuccessLstColor(res.body);
          }
        });
      }
      private onSuccessLstColor(obj: Color[] | null): void {
        this.colors = obj;
      }
    
      loadAllStorage(): void {
        this.StorageService.getLstStorage().subscribe({
          next: (res: HttpResponse<Storage[]>) => {
            this.onSuccessLstSto(res.body);
          }
        });
      }
      private onSuccessLstSto(objSto: Storage[] | null): void {
        this.storages = objSto;
      }
}
