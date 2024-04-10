import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageDigitalSignIconComponent } from './image-digital-sign-icon/image-digital-sign-icon.component';
import { ImageDigitalSignDesignComponent } from './image-digital-sign-design/image-digital-sign-design.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../../shared.module';
import { ImageDigitalSignPropComponent } from './image-digital-sign-prop/image-digital-sign-prop.component';
import { ngfModule } from 'angular-file';

@NgModule({
  declarations: [ImageDigitalSignIconComponent, ImageDigitalSignDesignComponent, ImageDigitalSignPropComponent],
  exports: [ImageDigitalSignIconComponent, ImageDigitalSignDesignComponent, ImageDigitalSignPropComponent],
  imports: [CommonModule, DragDropModule, SharedModule, ngfModule],
})
export class ImageDigitalSignModule {}
