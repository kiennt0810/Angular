import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentIconComponent } from './comment-icon/comment-icon.component';
import { CommentDesignComponent } from './comment-design/comment-design.component';
import { CommentPropComponent } from './comment-prop/comment-prop.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../../shared.module';
import { CommentInfoComponent } from './comment-info/comment-info.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [CommentIconComponent, CommentDesignComponent, CommentPropComponent, CommentInfoComponent],
  imports: [CommonModule, DragDropModule, SharedModule, FontAwesomeModule],
  exports: [CommentIconComponent, CommentDesignComponent, CommentPropComponent, CommentInfoComponent],
})
export class CommentModule {}
