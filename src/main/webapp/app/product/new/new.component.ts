import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbCalendar, NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgElement } from '@angular/elements';
import { ProductService } from '../product.service';
import { AlertService } from 'app/core/util/alert.service';
import { Router } from '@angular/router';
import { Product } from '../product.model';
import { AlertServiceCheck } from 'app/alertNew/alertNew.service';
import { SessionStorageService } from 'ngx-webstorage';
import { NavBarService } from 'app/layouts/navbar/nav-bar.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent, FocusEvent, BlurEvent } from '@ckeditor/ckeditor5-angular';
import { Brand } from 'app/quanlydanhmuc/Brand/Brand.model';
import { BrandService } from 'app/quanlydanhmuc/Brand/Brand.service';
import { Color } from 'app/quanlydanhmuc/Color/Color.model';
import { ColorService } from 'app/quanlydanhmuc/Color/Color.service';
import { Storage } from 'app/quanlydanhmuc/Storage/Storage.model';
import { StorageService } from 'app/quanlydanhmuc/Storage/Storage.service';

const ProductTemplate = {} as Product;
declare var $: any;
@Component({
  selector: 'jhi-hoCNgoaiGiao',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class newProductComponent implements OnInit {

  public Editor = ClassicEditor;
  public componentEvents: string[] = [];
  public isDisabled = false;
  public editorData =`<p>Mô tả</p>`;

  success = false;
  errorPassportExists = false;
  error = false;
  showWarning1 = false;
  showWarning2 = false;

  checkDouble = false;
  checkNullSoHC = false;
  checkKyTu = false;
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

  ProductForm = new FormGroup({
    id: new FormControl(ProductTemplate.id),
    tenSp: new FormControl(ProductTemplate.tenSp),
    soLuong: new FormControl(ProductTemplate.soLuong),
    giaThanh: new FormControl(ProductTemplate.giaThanh),
    moTa: new FormControl(ProductTemplate.moTa),
    idBrand: new FormControl(ProductTemplate.idBrand),
    idStorage: new FormControl(ProductTemplate.idStorage),
    idColor: new FormControl(ProductTemplate.idColor),
    createdBy: new FormControl(ProductTemplate.createdBy)
  });

  constructor(
    private Service: ProductService,
    private BrandService: BrandService,
    private ColorService: ColorService,
    private StorageService: StorageService,
    private router: Router,
    private alert: AlertServiceCheck,
    private sessionStorageService: SessionStorageService,
    private navbarService: NavBarService
  ) { }

  ngOnInit(): void {
    this.currentPath = this.router.url;
    console.log(this.currentPath);
    this.navbarService.getSubPath(this.currentPath, 'Thêm mới');
    this.loadAllBrand();
    this.loadAllColor();
    this.loadAllStorage();
  }

  isInvalidDate1(event) {
    let notice = event.target.value;
    if (notice == 'Invalid date') {
      this.showWarning1 = true;
      this.alert.warn('Vui lòng nhập ngày theo định dạng DD/MM/YYYY!');
      event.target.value = null
    } else {
      this.showWarning1 = false
    }
  }

  compareDate(d1: string) {
    let [day, month, year] = d1.split('/');
    const dateCompare = new Date(+year, +month - 1, +day).getTime();
    let date2 = new Date().getTime();
    if (dateCompare < date2) {
      return true;
    } else if (dateCompare > date2) {
      return false;
    } else {
      console.log(`Both dates are equal`);
    }
  };

  nameValidator(key: string) {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (key && nameRegexp.test(key)) {
      return true;
    } else {
      return false;
    }
  }

  compareDateHL(d1: string, d2: string) {
    let [day, month, year] = d1.split('/');
    const ngayGiao = new Date(+year, +month - 1, +day).getTime();
    let [day2, month2, year2] = d2.split('/');
    const ngayNhan = new Date(+year2, +month2 - 1, +day2).getTime();
    if (ngayGiao < ngayNhan) {
      return true;
    } else if (ngayGiao > ngayNhan) {
      return false;
    } else {
      return true;
    }
  };



  createProduct(): void {
    const formData = new FormData();
    const create = this.ProductForm.getRawValue();
    let userName: string = this.sessionStorageService.retrieve('userName');
    create.createdBy = userName;
    create.moTa = this.editorData.toString();
    this.Service.create(create).subscribe({ next: () => this.processSuscess(), error: response => this.processError(response) });
    }

  private processSuscess(): void {
      this.router.navigate(['/product']);
      this.alert.success('Thêm mới thành công');
  }


  private processError(response: HttpErrorResponse): void {
    if (response.status !== 200) {
      this.alert.error('Thêm mới không thành công');
    } else {
      this.router.navigate(['/product'])
      this.alert.success('Thêm mới thành công');
    }
  }

  previousState(): void {
    window.history.back();
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
