import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FeBaseDesign } from '../../fe-base-design.class';
import { FbMbusService } from '../../fb-mbus.service';
import { CommentService } from '../comment.service';

@Component({
  selector: 'jhi-comment-design',
  templateUrl: './comment-design.component.html',
  styleUrls: ['./comment-design.component.scss'],
})
export class CommentDesignComponent extends FeBaseDesign implements OnInit, OnDestroy, AfterViewInit {
  id: any;
  canClick = true;

  constructor(fbMbusService: FbMbusService, renderer: Renderer2, private commentService: CommentService) {
    super(fbMbusService, renderer);
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.destroy();
  }

  ngAfterViewInit(): void {
    this.initHandler();
    // this.changeFieldPositionHandle();
  }

  showCommentContent() {
    if (this.canClick) {
      this.commentService.setSelectedCommentId(this.id);
    }
  }

  closeCommentInfoDialog() {
    this.commentService.setUnselectComment();
  }

  setToCanClick(status: boolean) {
    if (!status) {
      this.canClick = false;
      this.commentService.setSelectedCommentId(this.id);
      this.closeCommentInfoDialog();
    } else {
      setTimeout(() => {
        this.canClick = true;
      }, 50);
    }
  }
}
