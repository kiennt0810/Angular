import { NgModule } from '@angular/core';
import { UpdateComponent } from './update/update.component';
import { CreateComponent } from './create/create.component';
import { DeleteComponent } from './delete/delete.component';
import { ListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { userManagementRoute } from './tiepkhachquocte.route';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewComponent } from './view/view.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AlertModuleCheck } from 'app/alertNew/alertNew.module';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
@NgModule({
  imports: [SharedModule, NgbDatepickerModule, FormsModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatCardModule, RouterModule.forChild(userManagementRoute),
    BsDatepickerModule.forRoot(),
    AlertModuleCheck],
  exports: [ListComponent,],
  declarations: [
    UpdateComponent,
    CreateComponent,
    ViewComponent,
    DeleteComponent,
    ListComponent,
  ]
})
export class TiepkhachquoctetModule { }
