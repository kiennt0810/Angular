import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AlertModuleCheck } from 'app/alertNew/alertNew.module';
import { ProductManagementRoute } from './product.route';
import { ProductManagementComponent } from './list/list.component';
import { newProductComponent } from './new/new.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ProductUpdateComponent } from './update/update.component';
import { ProductDeleteDialogComponent } from './delete/delete.component';
@NgModule({
  imports: [SharedModule, NgbDatepickerModule, FormsModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule, RouterModule.forChild(ProductManagementRoute),
    BsDatepickerModule.forRoot(),
    AlertModuleCheck,
    CKEditorModule],
  exports: [ProductManagementComponent,],
  declarations: [
    ProductManagementComponent,
    newProductComponent,
    ProductUpdateComponent,
    ProductDeleteDialogComponent,
  ]
})
export class ProductModule { }
