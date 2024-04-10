import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { LOGIN_FT_ROUTE } from './loginFT.route';
import { LoginFTComponent } from './loginFT.component';
import { AlertModuleCheck } from 'app/alertNew/alertNew.module';

@NgModule({
  imports: [SharedModule,AlertModuleCheck, RouterModule.forChild([LOGIN_FT_ROUTE])],
  declarations: [LoginFTComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginFTModule {}
