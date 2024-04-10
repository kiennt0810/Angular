export interface IUser {
  idNhom: number;
  idCn: string;
  maNhom: string;
  tenCN: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdDate: string | null;
  updatedDate: string | null;
    }
    
    export class User implements IUser {
      constructor(
        public idNhom: number,
        public idCn: string,
        public maNhom: string,
        public tenCN: string | null,
        public createdBy: string | null,
        public updatedBy: string | null,
        public createdDate: string | null,
        public updatedDate: string | null,
        ) { }
    }