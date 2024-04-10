import { FieldBox } from './field-box.model';

export class Comment {
  public id?: string;
  public name?: string;
  public createdBy?: string; // created by requester or coordinator
  public fieldBox?: FieldBox;
  public formula?: string;
  public value?: any;
  public valueHashSignature?: string;
  public valueCertChain?: string[];
  public valueCert?: string;
  public page?: number;
  public docId?: string;
  public recipientId?: string;
  public publish?: Boolean;
  public font?: string;
  public fontSize?: number;
  public color?: string;
  public isSent?: boolean;
  public comments?: Comment[];
  public createdDate?: any;
  public listSend?: string[];
  public subFieldBox?: FieldBox;
  public listValues?: any[];
}
