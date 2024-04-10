import { Comment } from './comment.model';
import { FieldValidator } from './field-validator.model';
import { FieldDesign } from './field-design.model';

export class Field extends Comment {
  public validators?: FieldValidator[];
  public type?: string;
  public subType?: string;
  // With FieldType = FieldType.SIGNATURE => subType = '1': image signature; '2': digital signature; '3': image-digital signature
  public valid?: boolean;
  public fieldDesign!: FieldDesign;
  public transparent!: boolean;
  public visibleSignature!: string;
  // leftbar comment
  public value?: any;
  public pattern?: any;
}
