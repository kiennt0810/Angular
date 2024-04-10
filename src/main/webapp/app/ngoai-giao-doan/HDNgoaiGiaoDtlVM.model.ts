

export interface IHDNgoaiGiaoDtlVM {
    stt?: number | null;
    id?: number | null;
    hoTen?: string |null;
    chucVu?: string | null;
    coQuan?: string | null;
    gioiTinh?: string | null;
  }
  
  export class HDNgoaiGiaoDtlVM implements IHDNgoaiGiaoDtlVM {
    constructor(
    public stt?: number | null,
    public id?: number | null,
    public hoTen?: string |null,
    public coQuan?: string | null,
    public gioiTinh?: string | null,
    public chucVu?: string | null,
    ) {}
  }
  