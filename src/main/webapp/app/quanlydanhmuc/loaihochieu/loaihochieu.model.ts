export interface IPassport {
    id: number | null;
    loaiHoChieu?: string | null;
    moTa?: string | null;
  tinhTrang?: boolean;
  createdBy?: string | null;
    updatedBy?: string | null;
  }
  
  export class Passport implements IPassport {
    constructor(
      public id: number | null,
      public loaiHoChieu?: string | null,
      public moTa?: string | null,
      public tinhTrang?: boolean,
      public createdBy?: string | null,
      public updatedBy?: string | null,
    ) {}
  }
  