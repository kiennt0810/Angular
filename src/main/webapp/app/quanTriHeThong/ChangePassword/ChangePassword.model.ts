export interface IUser {
  id: number;
  maNhanVien: string;
  matKhau: string;
  matKhauMoi: string;
  chucDanh: string;
  hoTen: string;
  tinhTrang: boolean;
  email: string;
  ngaySinh: string;
  gioiTinh: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdDate: string | null;
  updatedDate: string | null;
}
      
      export class User implements IUser {
        constructor(     
          public id: number,
          public maNhanVien: string,
          public matKhau: string,
          public matKhauMoi: string,
          public chucDanh: string,
          public hoTen: string,
          public tinhTrang: boolean,
          public email: string,
          public ngaySinh: string,
          public gioiTinh: true,
          public createdBy: string | null,
          public updatedBy: string | null,
          public createdDate: string | null,
          public updatedDate: string | null,
          ) { }
      }