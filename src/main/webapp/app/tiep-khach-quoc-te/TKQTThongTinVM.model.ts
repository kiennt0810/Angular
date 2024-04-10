import { TKQTThanhVienVM } from "./TKQTThanhVienVM.model";
import { FileUploadVM } from "./file.model";
export interface ITKQTThongTinVM {
  login: string | null;
  id?: number | null;
  lanhDao?: string |null;
  chucVu?: string | null;
  coQuan?: string | null;
  doanKhach?: string | null;
  quocGia?: string | null;
  diaDiem?: string | null;
  hinhThuc?: string | null;
  name?: number | null;
  thoiGianTu?: string | null,
  thoiGianDen?: string | null,
  soLuongTV?: string | null;
  tinhTrang?: boolean;
  listFile?: FileList | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdDate?: Date | null;
  updatedDate?: Date | null;
  jsonThanhVien ?: Array<TKQTThanhVienVM>;
  jsonKhach?: Array<TKQTThanhVienVM>;
  listTKQTThanhVienVM?: Array<TKQTThanhVienVM>,
  listTKQTKhachVM?: Array<TKQTThanhVienVM>,
  listTKQTFileVM?: Array<FileUploadVM>;
}

export class TKQTThongTinVM implements ITKQTThongTinVM {
  constructor(
    public login: string | null,
    public id?: number | null,
    public lanhDao?: string |null,
    public chucVu?: string | null,
    public coQuan?: string | null,
    public doanKhach?: string | null,
    public quocGia?: string | null,
    public diaDiem?: string | null,
    public hinhThuc?: string | null,
    public name?: number | null,
    public thoiGianTu?: string | null,
    public thoiGianDen?: string | null,
    public soLuongTV?: string | null,
    public tinhTrang?: boolean,
    public listFile?: FileList | null,
    public createdBy?: string | null,
    public updatedBy?: string | null,
    public createdDate?: Date | null,
    public updatedDate?: Date | null,
    public jsonThanhVien ?: Array<TKQTThanhVienVM>,
    public jsonKhach?: Array<TKQTThanhVienVM>,
    public listTKQTThanhVienVM?: Array<TKQTThanhVienVM>,
    public listTKQTKhachVM?: Array<TKQTThanhVienVM>,
    public listTKQTFileVM?: Array<FileUploadVM>,
  ) {}
}
