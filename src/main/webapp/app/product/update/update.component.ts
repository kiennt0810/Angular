import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
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
import { IFileUpload } from 'app/quanlydanhmuc/AdFile/create/create.component';
import { Product } from '../product.model';
import { ProFile } from '../proFile.model';

const ProductTemplate = {} as Product;
const fileTemplate = {} as ProFile;
declare var $: any;
const listOldFile = new FormArray([]);
@Component({
  selector: 'jhi-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;
  currentPath: string;
  loadProduct: Product | null = null;
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

  urlOldList: string[] = [];
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


  editForm = new FormGroup({
    id: new FormControl(),
    tenSp: new FormControl(),
    soLuong: new FormControl(),
    giaThanh: new FormControl(),
    moTa: new FormControl(),
    idBrand: new FormControl(),
    idStorage: new FormControl(),
    idColor: new FormControl(),
    createdBy: new FormControl(),
    listUrl: listOldFile,
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
      this.loadProduct = result;
      this.editForm = new FormGroup({
        id: new FormControl(result['id']),
        tenSp: new FormControl(result['tenSp']),
        soLuong: new FormControl(result['soLuong']),
        giaThanh: new FormControl(result['giaThanh']),
        moTa: new FormControl(result['moTa']),
        idBrand: new FormControl(result['idBrand']),
        idStorage: new FormControl(result['idStorage']),
        idColor: new FormControl(result['idColor']),
        createdBy: new FormControl(result['createdBy']),
        listUrl: listOldFile,
      })
      this.editorData = result['moTa'];
      listOldFile.clear();
      for (let i = 0; i < this.loadProduct.listUrl.length; i++) {
        this.listfileUp = new FormGroup({
          id: new FormControl(this.loadProduct.listUrl[i].id),
          imgUrl: new FormControl(this.loadProduct.listUrl[i].imgUrl),
          idProduct: new FormControl(this.loadProduct.listUrl[i].idProduct),
        })
        listOldFile.push(this.listfileUp);
      }
    });
    this.loadAllBrand();
    this.loadAllColor();
    this.loadAllStorage();
  }

  listfileUp = new FormGroup({
    id: new FormControl(fileTemplate.id),
    imgUrl: new FormControl(fileTemplate.imgUrl),
    idProduct: new FormControl(fileTemplate.idProduct),
  })

  get listFileControls() {
    return (<FormArray>this.editForm.get('listUrl')).controls;
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const formData = new FormData();
    const product = this.editForm.value;
    var idBrand: number;
    var idColor: number;
    var idStorage: number;
    let userName: string = this.sessionStorageService.retrieve('userName');

    for (let i = 0; i <= this.brands.length; i++) {
      if (this.brands[i]?.id === product.idBrand) {
        idBrand = this.brands[i].id;
        break;
      }
    }
    for (let i = 0; i <= this.colors.length; i++) {
      if (this.colors[i]?.id === product.idColor) {
        idColor = this.colors[i].id;
        break;
      }
    }
    for (let i = 0; i <= this.storages.length; i++) {
      if (this.storages[i]?.id === product.idStorage) {
        idStorage = this.storages[i].id;
        break;
      }
    }
    formData.append('id', "");
    formData.append('tenSp', product.tenSp);
    formData.append('soLuong', product.soLuong);
    formData.append('idBrand', String(idBrand));
    formData.append('idColor', String(idColor));
    formData.append('idStorage', String(idStorage));
    formData.append('giaThanh', product.giaThanh);
    formData.append('mota', this.editorData.toString());
    formData.append('createdBy', userName);
    for (let i = 0; i < this.urlList.length; i++) {
      formData.append('listFile', this.urlList[i]);
    }
    this.Service.update(formData).subscribe({ next: () => this.onSaveSuccess(), error: response => this.onSaveError(response) });

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
}
