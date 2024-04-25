
export interface IProduct {
    id: number | null;
    tenSp?: string | null;
    soLuong?: string | null;
    giaThanh?: string | null;
    moTa?: string | null;
    idBrand?: number | null;
    idStorage?: number | null;
    idColor?: number | null;
    createdBy?: string | null;
  }
  
  export class Product implements IProduct {
    constructor(
      public id: number | null,
      public tenSp?: string | null,
      public soLuong?: string | null,
      public giaThanh?: string | null,
      public moTa?: string | null,
      public idBrand?: number | null,
      public idStorage?: number | null,
      public idColor?: number | null,
      public createdBy?: string | null
    ) {}
  }
  