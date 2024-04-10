export interface IUser {
    id: number;
    maNhom: string;
    ten: string;
    tinhTrang: boolean;
    createdBy: string | null;
    updatedBy: string | null;
    createdDate: Date | null;
    updatedDate: Date | null;
    }
    
    export class User implements IUser {
      constructor(
        public id: number,
        public maNhom: string,
        public ten: string,
        public tinhTrang: boolean,
        public createdBy: string | null,
        public updatedBy: string | null,
        public createdDate: Date | null,
        public updatedDate: Date | null,
        ) { }
    }