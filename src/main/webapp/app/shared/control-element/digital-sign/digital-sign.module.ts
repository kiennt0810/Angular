import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalSignIconComponent } from './digital-sign-icon/digital-sign-icon.component';
import { DigitalSignDesignComponent } from './digital-sign-design/digital-sign-design.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../../shared.module';
import { DigitalSignPropComponent } from './digital-sign-prop/digital-sign-prop.component';

@NgModule({
  declarations: [DigitalSignIconComponent, DigitalSignDesignComponent, DigitalSignPropComponent],
  exports: [DigitalSignIconComponent, DigitalSignDesignComponent, DigitalSignPropComponent],
  imports: [CommonModule, DragDropModule, SharedModule],
})
export class DigitalSignModule {}
