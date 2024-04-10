import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { isNullOrUndefined } from '../../../util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';
import { AccountService } from '../../../../core/auth/account.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommentService } from '../comment.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-comment-info',
  templateUrl: './comment-info.component.html',
  styleUrls: ['./comment-info.component.scss'],
})
export class CommentInfoComponent implements OnInit {
  @Input() commentInfo: any;
  @Input() recipientListInput: any;
  @Input() isModified: any = false;
  @Input() isCreatingComment: any = false;
  @Output() removeCommentEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() saveCommentEvent: EventEmitter<any> = new EventEmitter<any>();
  recipientList: any;
  currentUser: string;

  commentForm: FormGroup = this.fb.group({
    listSend: [[]],
    commentContent: [''],
    privacy: ['private'],
  });

  isShowSubCommentOption = false;
  isEditingComment = false;
  isCollapse = false;

  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private router: Router,
    private accountService: AccountService,
    private sessionStorage: SessionStorageService,
    private translateService: TranslateService,
    private ngbModal: NgbModal,
    public faLibrary: FaIconLibrary
  ) {
    this.faLibrary.addIcons(faAngleDown, faAngleUp);
    if (!isNullOrUndefined(this.accountService.getAccount())) {
      this.currentUser = this.accountService.getAccount().login;
    } else {
      const userInfo = JSON.parse(this.sessionStorage.retrieve('RecipientAuth'));
      if (!isNullOrUndefined(userInfo)) {
        if (!isNullOrUndefined(userInfo.email)) {
          this.currentUser = userInfo.email;
        } else {
          // const _envelope = this.sessionStorage.retrieve(ENVELOPE_KEY_STORAGE);
          // if (!isNullOrUndefined(_envelope)) {
          //   _envelope.parties.forEach(party => {
          //     party.recipients.forEach(recipient => {
          //       if (recipient.id === userInfo.recipientId) {
          //         this.currentUser = recipient.contact.email;
          //       }
          //     });
          //   });
          // }
        }
      }
    }
  }

  ngOnInit() {
    this.updateCommentValueToForm();
    this.updateRecipientList();
  }

  ngOnChanges(): void {
    this.updateCommentValueToForm();
    this.updateRecipientList();
  }

  ngAfterViewInit(): void {
    this.commentForm.valueChanges.subscribe(res => {
      const commentField = JSON.parse(JSON.stringify(this.commentInfo));
      commentField.listSend = res.listSend;
      commentField.value = res.commentContent;
      commentField.publish = res.privacy === 'global';
      if (commentField.listSend.includes('all') || commentField.listSend.includes('Tất cả')) {
        commentField.listSend = this.recipientList
          .map(recipient => {
            return recipient.email;
          })
          .filter(email => email !== 'all' && email !== 'Tất cả');
      }
      // this.commentService.updateCommentValue(commentField);
    });
  }

  updateCommentValueToForm() {
    if (!isNullOrUndefined(this.commentInfo)) {
      this.isEditingComment = false;
      if (isNullOrUndefined(this.commentInfo.listSend)) {
        this.commentForm.get('listSend').setValue([]);
      } else {
        this.commentForm.get('listSend').setValue(this.commentInfo.listSend);
      }
      this.commentForm.get('commentContent').setValue(this.commentInfo.value);
      this.commentForm.get('privacy').setValue(this.commentInfo.publish === true ? 'global' : 'private');
      // if (this.currentUser !== this.commentInfo.createdBy) {
      //   this.commentForm.get('listSend').disable();
      //   this.commentForm.get('commentContent').disable();
      // } else {
      //   this.commentForm.get('listSend').enable();
      //   this.commentForm.get('commentContent').enable();
      // }
      if (this.isCreatingComment) {
        this.commentForm.get('listSend').enable();
        this.commentForm.get('commentContent').enable();
        this.commentForm.get('privacy').enable();
      } else {
        this.commentForm.get('listSend').disable();
        this.commentForm.get('commentContent').disable();
        this.commentForm.get('privacy').disable();
      }
    }
  }

  updateRecipientList() {
    if (!isNullOrUndefined(this.recipientListInput)) {
      this.recipientList = this.recipientListInput.map(recipient => {
        return {
          label: recipient.contact.name,
          email: recipient.contact.email,
          name: recipient.contact.name,
          phone: recipient.contact.phone,
        };
      });

      this.recipientList = this.removeArrayDuplicateValue(this.recipientList);

      if (this.translateService.currentLang === 'vi') {
        this.recipientList.unshift({
          label: 'Tất cả',
          email: 'Tất cả',
          name: 'Tất cả',
          phone: '0000000000',
        });
      } else {
        this.recipientList.unshift({
          label: 'All',
          email: 'all',
          name: 'All',
          phone: '00000000000',
        });
      }
    }
  }

  removeArrayDuplicateValue(arr: any) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
      let isDuplicate = false;
      result.forEach(item => {
        // if (JSON.stringify(item) === JSON.stringify(arr[i])) {
        if (item.email === arr[i].email) {
          isDuplicate = true;
        }
      });
      if (!isDuplicate) {
        result.push(arr[i]);
      }
    }
    return result;
  }

  removeComment() {
    this.removeCommentEvent.emit(this.commentInfo.id);
  }

  onChangeRecipient(sendTos: any) {}

  onChangeContent() {}

  saveComment() {
    this.isShowSubCommentOption = false;
    this.commentForm.get('listSend').disable();
    this.commentForm.get('commentContent').disable();
    this.commentForm.get('privacy').disable();
    this.isEditingComment = false;
    this.saveCommentEvent.emit(this.commentInfo.id);
  }

  editComment() {
    this.isEditingComment = true;
    this.isShowSubCommentOption = false;
    this.commentForm.get('listSend').enable();
    this.commentForm.get('commentContent').enable();
    this.commentForm.get('privacy').enable();
  }

  canShowSaveBtn() {
    return true;
  }

  canDeleteAndEdit() {
    if (this.commentInfo.createdBy === this.currentUser) {
      return true;
    } else {
      return false;
    }
  }

  canDeleteAndSave(btn?: string) {
    // const _canDeleteAndEdit = this.sessionStorage.retrieve(CAN_EDIT_COMMENT);
    // if (btn === 'delete') {
    //   if (_canDeleteAndEdit !== false && this.commentInfo.createdBy === this.currentUser) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // } else {
    //   if (
    //     _canDeleteAndEdit !== false &&
    //     this.commentInfo.createdBy === this.currentUser &&
    //     !isNullOrUndefined(this.commentForm.get('commentContent').value) &&
    //     this.commentForm.get('commentContent').value !== ''
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }

    return true;
  }

  @HostListener('document:click', ['$event'])
  handleCloseCommentOption(e: any) {
    if (!isNullOrUndefined(e)) {
      const classList = e.target.classList.value;
      const tagName = e.target.tagName;
      if (!classList.includes('show-comment-option-trigger') && tagName !== 'svg' && tagName !== 'path') {
        this.isShowSubCommentOption = false;
      }
    }
  }

  showSubCommentOption() {
    this.isShowSubCommentOption = true;
  }

  openHistoryDialog() {
    // const envelope = this.sessionStorage.retrieve(ENVELOPE_KEY_STORAGE);
    // if (!isNullOrUndefined(envelope)) {
    //   const commentUpdateHistoryDialog = this.ngbModal.open(CommentUpdateHistoryComponent, {
    //     size: 'lg',
    //     backdrop: 'static',
    //     windowClass: 'commentUpdateHistoryDialog',
    //     keyboard: false
    //   });
    //
    //   commentUpdateHistoryDialog.componentInstance.commentId = this.commentInfo.id;
    //   commentUpdateHistoryDialog.componentInstance.envelopeId = envelope.id;
    // }
  }

  setCommentPrivacy(value: string) {
    this.commentForm.get('privacy').setValue(value);
    this.isCollapse = false;
  }

  getCommentPrivacy() {
    return this.commentForm.get('privacy').value;
  }
}
