import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalSignModule } from './digital-sign/digital-sign.module';
import { ImageDigitalSignModule } from './image-digital-sign/image-digital-sign.module';
import { FeBaseDesign } from './fe-base-design.class';
import { CommentModule } from './comment/comment.module';
import { ControlTemplateNewComponent } from './control-template-new/control-template-new.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [FeBaseDesign, ControlTemplateNewComponent],
  entryComponents: [ControlTemplateNewComponent],
  imports: [CommonModule, DigitalSignModule, ImageDigitalSignModule, CommentModule, ReactiveFormsModule, SharedModule, FontAwesomeModule],
  exports: [DigitalSignModule, ImageDigitalSignModule, CommentModule],
})
export class ControlElementModule {
  constructor() {}
}
