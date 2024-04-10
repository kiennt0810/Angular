import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { LOGIN_ROUTE } from './login.route';
import { LoginComponent } from './login.component';
import { AlertModuleCheck } from 'app/alertNew/alertNew.module';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([LOGIN_ROUTE]), AlertModuleCheck],
  declarations: [LoginComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginModule {}
