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
import { IFileUpload } from 'app/quanlydanhmuc/AdFile/create/create.component';

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

  lstUploadedFiles: IFileUpload[] = [];
  selectedFile = null;
  isuploadDocument: boolean;
  fileToUpload: File = null;
  checkNameFile = true;
  nameFile: string[] = [];
  totalFileSize: number;
  fileUploaded: IFileUpload = null;
  fileList: File[] = [];
  checkUpload = false;

  urlList: string[] = [];

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
    createdBy: new FormControl(ProductTemplate.createdBy),
    fileImg: new FormControl(ProductTemplate.fileImg),
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
    this.totalFileSize = 0;
    this.fileList = [];
    this.currentPath = this.router.url;
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

  onRemove(event) {
    this.fileList.splice(this.fileList.indexOf(event), 1);
  }

  uploadImg() {
    this.checkUpload = false;
        for (let i = 0; i < this.fileList.length; i++) {
            this.readUploadedFileAsDataUrl(this.fileList[i]).then(fileContents => {
                this.Service.upload2imgur(fileContents).then((ret: any) => {
                    ret = JSON.parse(ret.target.response);
                    this.urlList.push((ret.data.link).toString());
                    this.onRemove(this.fileList[i]);
                    if (i = this.fileList.length) {
                        this.alert.success('Upload ảnh thành công');
                        this.checkUpload = true;
                    }
                })
            });
        }
  }

  createProduct(): void {
    const formData = new FormData();
    const create = this.ProductForm.value;
    var idBrand: number;
    var idColor: number;
    var idStorage: number;

    for (let i = 0; i <= this.brands.length; i++) {
      if (this.brands[i]?.id === create.idBrand) {
        idBrand = this.brands[i].id;
        break;
      }
    }
    for (let i = 0; i <= this.colors.length; i++) {
      if (this.colors[i]?.id === create.idColor) {
        idColor = this.colors[i].id;
        break;
      }
    }
    for (let i = 0; i <= this.storages.length; i++) {
      if (this.storages[i]?.id === create.idStorage) {
        idStorage = this.storages[i].id;
        break;
      }
    }
    let userName: string = this.sessionStorageService.retrieve('userName');
    formData.append('tenSp', create.tenSp);
    formData.append('soLuong', create.soLuong);
    formData.append('idBrand', String(idBrand));
    formData.append('idColor', String(idColor));
    formData.append('idStorage', String(idStorage));
    formData.append('giaThanh', create.giaThanh);
    formData.append('mota', this.editorData.toString());
    formData.append('createdBy', userName);
    for (let i = 0; i < this.urlList.length; i++) {
      formData.append('listFile', this.urlList[i]);     
  }
    this.Service.create(formData).subscribe({ next: () => this.processSuscess(), error: response => this.processError(response) });
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

  handleFileInput = async (event) => {
    this.selectedFile = event.target.files;

    ProductTemplate.fileImg = event.target.files;
    this.isuploadDocument = false;
    if (ProductTemplate.fileImg.length > 0) {
        for (let i = 0; i < ProductTemplate.fileImg.length; i++) {
            this.fileToUpload = ProductTemplate.fileImg.item(i);
            for (let j = 0; j < this.nameFile.length; j++) {
                if (this.fileToUpload.name == this.nameFile[j]) {
                    this.checkNameFile = false;
                    break;
                }
            }
            if (this.checkNameFile) {
                this.totalFileSize = this.totalFileSize + this.fileToUpload.size;
                if (this.totalFileSize <= 104857600) {
                    this.fileUploaded = {
                        RequestID: '',
                        AttachmentFlag: true,
                        FormType: 'MRF',
                        AttachmentName: this.fileToUpload.name,
                        AttachmentContent: await this.readUploadedFileAsDataUrl(ProductTemplate.fileImg.item(i))
                    };
                    this.lstUploadedFiles.push(this.fileUploaded);
                    this.fileList.push(this.selectedFile[i]);
                    this.isuploadDocument = true;
                } else {
                    this.isuploadDocument = false;
                    this.alert.error('Tải file không quá 100 MB');
                }
            }
        }
    }
}

remove(filename: string, i: number): void {
    this.fileList.splice(i, 1);
    $('#inputGroupFile').val(null);
    ProductTemplate.fileImg = [].slice.call(ProductTemplate.fileImg).filter(e => e.name !== filename);
    this.lstUploadedFiles = this.lstUploadedFiles.filter(e => e.AttachmentName !== filename);
    this.totalFileSize = 0;
    this.lstUploadedFiles.forEach(fl => {
        this.totalFileSize = this.totalFileSize + fl.AttachmentContent.length;
    });
}

readUploadedFileAsDataUrl = (inputFile) => {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(this.alert.error('Không thể tải file'));
        };
        temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result);
        };
        temporaryFileReader.readAsDataURL(inputFile);
    });
}
}
