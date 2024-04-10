
    export interface IUser {
      id: number | null;
      maNhanVien: string;
      matKhau: string | null;
      chucDanh: string | null;
      hoTen: string ;
      tinhTrang: boolean;
      createdBy: string | null;
      updatedBy: string | null;
      createdDate: Date | null;
      updatedDate: Date | null;
      email: string | null;
      gioiTinh: boolean | null;
      ngaySinh: string | null;
    }
      
      export class User implements IUser {
        constructor(
          public id: number | null,
          public maNhanVien: string,
          public matKhau: string | null,
          public chucDanh: string | null,
          public hoTen: string,
          public tinhTrang: boolean,
          public createdBy: string | null,
          public updatedBy: string | null,
          public createdDate: Date | null,
          public updatedDate: Date | null,
          public email: string | null,
          public gioiTinh: boolean | null,
          public ngaySinh: string | null,
        ) {}
      }
      