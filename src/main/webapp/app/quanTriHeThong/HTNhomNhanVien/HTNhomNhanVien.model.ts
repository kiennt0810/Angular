export interface IUser {
  id: number;
  idNhanVien: number;
  idNhom: number;
  maNhanVien: string;
  maNhom: string;
  tenNhanVien: string;
  htNhanVien: string | null;
  htNhom: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdDate: string | null;
  updatedDate: string | null;
    }
    
    export class User implements IUser {
      constructor(
        public id: number,
        public idNhanVien: number,
        public idNhom: number,
        public maNhanVien: string,
        public maNhom: string,
        public tenNhanVien: string,
        public htNhanVien: string | null,
        public htNhom: string | null,
        public createdBy: string | null,
        public updatedBy: string | null,
        public createdDate: string | null,
        public updatedDate: string | null,
        ) { }
    }