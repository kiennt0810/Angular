export interface ITKQTThanhVienVM {
  // stt: number | null;
  id?: number | null;
  soHC?: string |null;
  hoTen?: string | null;
  chucVu?: string | null;
  coQuan?: string | null;
  gioiTinh?: boolean;
  ngaySinh?: Date | null;
  type?: number  | null;
  tkqtid?: number  | null;
}

export class TKQTThanhVienVM implements ITKQTThanhVienVM {
  constructor(
  public id?: number | null,
  public soHC?: string |null,
  public hoTen?: string | null,
  public chucVu?: string | null,
  public coQuan?: string | null,
  public gioiTinh?: boolean,
  public ngaySinh?: Date | null,
  public type?: number  | null,
  public tkqtid?: number  | null,
  ) {}
}
