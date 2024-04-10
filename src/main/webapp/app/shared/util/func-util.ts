import { Subscription } from 'rxjs';
import { Field } from '../model/field.model';
import { COLORS, RecipientRole } from '../control-element/enum.constants';

export function isNullOrUndefined(value: any) {
  return value === null || value === undefined;
}
export function isNullOrUndefinedOrEmpty(value: any) {
  return value === undefined || value === null || value === '';
}

export function isNullOrEmpty(value: any[]) {
  return value === undefined || value === null || value.length === 0;
}

export function clearSession() {
  sessionStorage.clear();
}

export function isNumber(word: string | number): boolean {
  return /\d/.test(word + '');
}

export function clearSubscriptions(...subscriptions: Subscription[]) {
  if (subscriptions) {
    subscriptions.forEach(s => {
      if (s) {
        s.unsubscribe();
        s = null;
      }
    });
  }
}

export function isMobileScreen(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent);
}

export function isDesktopScreen(): boolean {
  return window.innerWidth > 1280;
}

export function setNotificationAmountToWebTabTitle(): any {
  let arr = document.title.split(') ');
  const notificationAmount = sessionStorage.getItem('jhi-notification_amount');
  if (arr.length > 1) {
    document.title = arr[1];
    if (!isNullOrUndefined(notificationAmount)) {
      if (+notificationAmount !== 0 && notificationAmount !== '0') {
        if (+notificationAmount > 20) {
          document.title = `(20+) ` + document.title;
        } else {
          document.title = `(${notificationAmount}) ` + document.title;
        }
      }
    }
  } else {
    if (!isNullOrUndefined(notificationAmount)) {
      if (+notificationAmount !== 0 && notificationAmount !== '0') {
        if (+notificationAmount > 20) {
          document.title = `(20+) ` + document.title;
        } else {
          document.title = `(${notificationAmount}) ` + document.title;
        }
      }
    }
  }
}

// export function createFavoriteEnvDto(acc: Account, envId: string, hashtagList: string[], favoriteEnvId: string, aliasName) {
//   return {
//     aliasName: aliasName,
//     createdBy: null,
//     createdDate: null,
//     custId: acc.custId,
//     hashTag: hashtagList,
//     id: isNullOrUndefined(favoriteEnvId) ? null : favoriteEnvId,
//     lastModifiedBy: null,
//     lastModifiedDate: null,
//     orgIn: acc.orgIn,
//     personal: acc.email,
//     resourceId: envId,
//     resourceType: 'e'
//   };
// }

export function getInitials(param: string): string {
  let res = '';
  if (!isNullOrUndefined(param)) {
    if (param.includes(' ')) {
      const params = param.split(' ');
      if (params.length > 1) {
        params.forEach(i => {
          res = res + i.substr(0, 1);
        });
      } else {
        res = params[0];
      }
    } else {
      res = param;
    }
  }
  return res.toLocaleUpperCase();
}

export class Guid {
  private _guid: string;
  // Static member
  static get(): Guid {
    let result: string;
    let i: string;
    let j: number;
    result = '';
    for (j = 0; j < 19; j++) {
      i = Math.floor(Math.random() * 16).toString(16);
      result = result + i;
    }
    return new Guid(result);
  }

  constructor(guid: string) {
    this._guid = guid;
  }
  public toString(): string {
    return this._guid;
  }
}

export function findRecipient(recipientId: string, envelope: any) {
  if (isNullOrUndefined(recipientId) || isNullOrUndefined(envelope)) {
    return null;
  }
  if (!isNullOrUndefined(envelope.requester) && envelope.requester.id === recipientId) {
    return envelope.requester;
  }
  let ret = null;
  if (!isNullOrUndefined(envelope.parties)) {
    envelope.parties.forEach(v => {
      if (!isNullOrUndefined(v.recipients)) {
        v.recipients.forEach(f => {
          if (f.id === recipientId) {
            ret = f;
          }
        });
      }
    });
  }
  return ret;
}

export function addFieldToRecipient(field: Field, recipient: any) {
  if (isNullOrUndefined(field) || isNullOrUndefined(recipient)) {
    return;
  }
  if (isNullOrUndefined(recipient.fields)) {
    recipient.fields = [];
  }

  for (const fld of recipient.fields) {
    if (fld.id === field.id) {
      return;
    }
  }
  recipient.fields.push(field);
}

export function getSigners(envelope: any, type: string) {
  const ret = [];
  if (isNullOrUndefined(envelope) || isNullOrUndefined(envelope.parties)) {
    return ret;
  }
  // envelope.parties.forEach((v, i) => {
  //   if (!isNullOrUndefined(v.recipients)) {
  //     v.recipients.forEach(rp => {
  //       if (
  //         !isNullOrUndefined(rp.contact) &&
  //         (rp.role === RecipientRole.SIGNER || rp.role === RecipientRole.STAMPER || rp.role === RecipientRole.COORDINATOR)
  //       ) {
  //         if (type === 'a') {
  //           ret.push({ id: rp.id, value: rp.contact.name, color: COLORS[rp.index] });
  //         } else if (type === 'd' && (rp.role === RecipientRole.COORDINATOR || this.hasDigitalSign(rp, envelope))) {
  //           ret.push({ id: rp.id, value: rp.contact.name, color: COLORS[rp.index] });
  //         } else if (type === 'i' && (rp.role === RecipientRole.COORDINATOR || this.nonDigitalSign(rp, envelope))) {
  //           ret.push({ id: rp.id, value: rp.contact.name, color: COLORS[rp.index] });
  //         }
  //       }
  //     });
  //   }
  // });
  return ret;
}
