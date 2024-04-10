import { HDNgoaiGiaoDtlVM } from "./HDNgoaiGiaoDtlVM.model";
import { HDNgoaiGiaoDtlFileVM } from "./HDNgoaiGiaoDtlFileVM.model";
export interface IHDNgoaiGiaoVM {
  login: string | null;
  id?: number | null;
  tenHD?: string |null;
  coQuan?: string | null;
  quocGia?: string | null;
  hinhThuc?: string | null;
  tangPham?: string | null;
  thoiGian?: string | null;
  ghiChu?: string | null;
  diaDiem?: string | null;
  fileHoSo?: FileList | null,
  thanhPhanThamDu?: string | null;
  nam?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdDate?: Date | null;
  updatedDate?: Date | null;
  listFile?: FileList | null;
  listFileAll?: FileList | null;
  jsonHDNgoaiGiaoDtl ?: Array<HDNgoaiGiaoDtlVM>;
  lsThanhPhanThamDu?: Array<HDNgoaiGiaoDtlVM>;
  listHDDtlFileVM?: Array<HDNgoaiGiaoDtlFileVM>;
}

export class HDNgoaiGiaoVM implements IHDNgoaiGiaoVM {
  constructor(
  public login: string | null,
  public id?: number | null,
  public tenHD?: string |null,
  public coQuan?: string | null,
  public quocGia?: string | null,
  public hinhThuc?: string | null,
  public tangPham?: string | null,
  public thoiGian?: string | null,
  public ghiChu?: string | null,
  public diaDiem?: string | null,
  public fileHoSo?: FileList | null,
  public thanhPhanThamDu?: string | null,
  public nam?: number | null,
  public createdBy?: string | null,
  public updatedBy?: string | null,
  public createdDate?: Date | null,
  public updatedDate?: Date | null,
  public listFile?: FileList | null,
  public listFileAll?: FileList | null,
  public jsonHDNgoaiGiaoDtl ?: Array<HDNgoaiGiaoDtlVM>,
  public lsThanhPhanThamDu?: Array<HDNgoaiGiaoDtlVM>,
  public listHDDtlFileVM?: Array<HDNgoaiGiaoDtlFileVM>,
  ) {}
}
