import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FieldType } from '../../enum.constants';
import { isNullOrUndefined } from '../../../util/func-util';
import { SessionStorageService } from 'ngx-webstorage';
import { AccountService } from '../../../../core/auth/account.service';

@Component({
  selector: 'jhi-comment-icon',
  templateUrl: './comment-icon.component.html',
  styleUrls: ['./comment-icon.component.scss'],
})
export class CommentIconComponent implements OnInit {
  @ViewChild('icon', { static: true }) iconRef: ElementRef;
  @Input() width: any;
  @Input() height: any;
  currentUser: any;

  constructor(private accountService: AccountService, private sessionStorage: SessionStorageService) {
    // if (!isNullOrUndefined(this.accountService.getAccount())) {
    //   this.currentUser = this.accountService.getAccount().login;
    // } else {
    //   const userInfo = JSON.parse(this.sessionStorage.retrieve('RecipientAuth'));
    //   if (!isNullOrUndefined(userInfo)) {
    //     if (!isNullOrUndefined(userInfo.email)) {
    //       this.currentUser = userInfo.email;
    //     } else {
    //       const _envelope = this.sessionStorage.retrieve(ENVELOPE_KEY_STORAGE);
    //       if (!isNullOrUndefined(_envelope)) {
    //         _envelope.parties.forEach(party => {
    //           party.recipients.forEach(recipient => {
    //             if (recipient.id === userInfo.recipientId) {
    //               this.currentUser = recipient.contact.email;
    //             }
    //           });
    //         });
    //       }
    //     }
    //   }
    // }
  }

  ngOnInit() {}

  onDragStart(e: any) {
    e.dataTransfer.setData('type', FieldType.COMMENT);
    const ratio = this.getClickPositionRatio(e.clientX, e.clientY);
    e.dataTransfer.setData('ratioX', ratio.x);
    e.dataTransfer.setData('ratioY', ratio.y);
    e.dataTransfer.setData('templateWidth', null);
    e.dataTransfer.setData('templateHeight', null);
    e.dataTransfer.setData('createdBy', this.currentUser);
    e.dataTransfer.setData('createdDate', Date.now() + '');
  }

  getClickPositionRatio(x: number, y: number) {
    if (this.iconRef !== null) {
      const rect = this.iconRef.nativeElement.getBoundingClientRect();
      return { x: (x - rect.left) / rect.width, y: (y - rect.top) / rect.height };
    }
    return { x: 0.5, y: 0.5 };
  }
}
