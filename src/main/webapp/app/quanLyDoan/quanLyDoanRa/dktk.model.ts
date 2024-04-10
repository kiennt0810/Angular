
export interface IDktk {
  maDoan?: number;
  tenDoan?: string | null;
  truongDoan?: string | null;
  chucVu?: string | null;
  maQG?: string | null;
  mucDichHD?: string | null;
  nam?: number | null;
  ngayNC?: string | null ;
  ngayXC?: string | null;
  page?: number | null;
}

export class Dktk implements IDktk {
  constructor(
    public maDoan?: number,
    public tenDoan?: string | null,
    public truongDoan?: string | null,
    public chucVu?: string | null,
    public maQG?: string | null,
    public mucDichHD?: string | null,
    public ngayNC?: string | null,
    public nam?: number | null,
    public ngayXC?: string | null,
    public page? : number | null,
  ) {}
}
