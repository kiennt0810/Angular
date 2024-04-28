
export interface ICustomer {
    id: number | null;
    hoTen?: string | null;
    ngaySinh?: string | null;
    diaChi?: string | null;
    dienThoai?: string | null;
    email?: string | null;
    userName?: string | null;
    gioiTinh?: boolean;
    trangThai?: boolean;
  }
  
  export class Customer implements ICustomer {
    constructor(
      public id: number | null,
      public hoTen?: string | null,
      public ngaySinh?: string | null,
      public diaChi?: string | null,
      public dienThoai?: string | null,
      public email?: string | null,
      public userName?: string | null,
      public gioiTinh?: boolean,
      public trangThai?: boolean
    ) {}
  }
  