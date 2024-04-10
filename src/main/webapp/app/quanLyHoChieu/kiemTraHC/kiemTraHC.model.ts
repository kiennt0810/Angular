

export interface IKiemTraHC {
  stt?: number | null;
  soHC?: string | null;
  loaiHC?: string | null;
  hoTen?: string | null;
  gioiTinh?: string | null;
  ngaySinh?: string | null;
  noiSinh?: string | null;
  cmndSo?: string | null;
  chucVu?: string | null;
  coQuan?: string | null;
  cmndNgayCap?: string | null;
  cmndNgayHL?: string | null;
  cmndNoiCap?: string | null;
  tGianHL?: number | null;
  trangThai?: string | null;
  trangThaiEx?: string | null;
}

export class KiemTraHC implements IKiemTraHC {
  constructor(
    public stt?: number | null,
    public soHC?: string | null,
    public loaiHC?: string | null,
    public hoTen?: string | null,
    public gioiTinh?: string | null,
    public ngaySinh?: string | null,
    public noiSinh?: string | null,
    public cmndSo?: string | null,
    public chucVu?: string | null,
    public coQuan?: string | null,
    public cmndNgayCap?: string | null,
    public cmndNgayHL?: string | null,
    public cmndNoiCap?: string | null,
    public tGianHL?: number | null,
    public trangThai?: string | null,
    public trangThaiEx?: string | null,
  ) {}
}
