import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertServiceCheck } from './alertNew.service';
import { AlertComponentCheck } from './alertNew.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AlertComponentCheck
  ],
  providers: [AlertServiceCheck],
  exports: [AlertComponentCheck]
})
export class AlertModuleCheck { }