import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';
import { CategoriesManagementComponent } from './list/doanVaoList.component';
import { CategoriesManagementDetailComponent } from './detail/categories-management-detail.component';
// import { CategoriesManagementUpdateComponent } from './update/categories-management-update.component';
import { CategoriesManagementDeleteDialogComponent } from './delete/categories-management-delete-dialog.component';
import { userManagementRoute } from './doanVao.route';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './create/create.component';
// import { ViewComponent } from './view/view.component';
import { MatIconModule } from '@angular/material/icon';

import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { DoanVaoViewComponent } from './view/view.component';
import { DoanVaoEditComponent } from './edit/edit.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ListTVComponent } from './list-tv/list-tv.component';
import { AlertModuleCheck } from 'app/alertNew/alertNew.module';


@NgModule({
  imports: [SharedModule,
    NgbDatepickerModule,
    FormsModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    RouterModule.forChild(userManagementRoute),
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    BsDatepickerModule.forRoot(),
    AlertModuleCheck,
  ],
  exports: [CategoriesManagementComponent,],
  declarations: [
    CategoriesManagementComponent,
    CategoriesManagementDetailComponent,
    // CategoriesManagementUpdateComponent,
    CategoriesManagementDeleteDialogComponent,
    CreateComponent,
    DoanVaoViewComponent,
    DoanVaoEditComponent,
    ListTVComponent,
  ],
  bootstrap:    [ CreateComponent ]
})
export class CategoriesManagementModule { }
