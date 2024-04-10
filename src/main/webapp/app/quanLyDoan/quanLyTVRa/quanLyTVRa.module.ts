import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';
import { quanLyTVRoute } from './quanLyTVRa.route';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { quanLyTVDeleteDialogComponent } from './delete/quanLyTV-delete-dialog.component';
import { quanLyTVRaComponent } from './list/quanLyTVRa.component';
import { CreateComponent } from './create/create.component';
import { QuanLyTvRaViewComponent } from './view/view.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TvEditComponent } from './edit/edit.component';
import { AlertModuleCheck } from 'app/alertNew/alertNew.module';
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
    AlertModuleCheck,
  ],
  exports: [quanLyTVRaComponent,],
  declarations: [
    quanLyTVRaComponent,
    quanLyTVDeleteDialogComponent,
    CreateComponent,
    QuanLyTvRaViewComponent,
    TvEditComponent,
  ],
})
export class QuanLyTVModule {}
