export class FieldDesign {
  public id?: string;
  public type?: string;
  public w?: number;
  public h?: number;
  public fieldLogoDesign?: FieldLogoDesign;
  public fieldTextDesign?: FieldTextDesign;
}

export class FieldLogoDesign {
  public position?: string;
  public size?: number;
  public required?: boolean;
  public value?: string;
}

export class FieldTextDesign {
  public position?: string;
  public required?: boolean;
  public items?: any;
  public color?: string;
  public multiLine?: boolean;
  public font?: string;
}
