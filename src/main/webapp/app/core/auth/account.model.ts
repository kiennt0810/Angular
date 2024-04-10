export class Account {
  constructor(
    public activated: boolean,
    public authorities: string[],
    public email: string,
    public firstName: string | null,
    public langKey: string,
    public lastName: string | null,
    public login: string,
    public imageUrl: string | null,
    
    public id : number,
    public maNhanVien: string,
    public matKhau : string| null,
    public chucDanh : string| null,
    public hoTen: string| null,
    public tinhTrang: boolean,    
    public ngaySinh: string| null,
    public gioiTinh: boolean    
  ) {}
}
