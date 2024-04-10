import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';
import { quanLyTVComponent } from './list/quanLyTV.component';
// import { CategoriesManagementDetailComponent } from './detail/categories-management-detail.component';
// import { CategoriesManagementUpdateComponent } from './update/categories-management-update.component';
import { quanLyTVDeleteDialogComponent } from './delete/quanLyTV-delete-dialog.component';
import { quanLyTVRoute } from './quanLyTV.route';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { QuanLyTvViewComponent } from './view/view.component';
import { TvEditComponent } from './edit/edit.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AlertModuleCheck } from 'app/alertNew/alertNew.module';
import { CreateComponent } from './create/create.component';
// import { ViewComponent } from './view/view.component';


@NgModule({
  imports: [
    SharedModule, 
    NgbDatepickerModule, 
    FormsModule, 
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule,
    RouterModule.forChild(quanLyTVRoute),
    BsDatepickerModule.forRoot(),
    AlertModuleCheck],
  exports: [quanLyTVComponent,],
  declarations: [
    quanLyTVComponent,
    quanLyTVDeleteDialogComponent,
    CreateComponent,
    QuanLyTvViewComponent,
    TvEditComponent,
  ],
})
export class QuanLyTVModule {}
