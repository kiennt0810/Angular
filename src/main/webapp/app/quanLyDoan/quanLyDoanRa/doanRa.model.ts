import { FileUploadVM } from "../file.model";
import { LanhDao } from "./lanhDao.model";
import { QGiaDen } from "./qGiaDen.model";

export interface IDoanRa {
  maDoan?: number;
  tenDoan?: string | null;
  truongDoan?: string | null;
  chucVu?: string | null;
  quocGia?: string | null;
  mucDichHD?: string | null;
  nam?: number | null;
  ngayNC?: string | null ;
  ngayXC?: string | null;
  soNgay?: number;
  noiLuuTru?: string | null;
  ghiChu?: string | null;
  soLuongTV?: number | null;
  listFile?: FileList | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdDate?: Date | null;
  updatedDate?: Date | null;
  jsonLanhDao?: Array<LanhDao>;
  jsonHoSoDtl?: Array<QGiaDen>;
  listLanhDao?: Array<LanhDao>;
  listHoSoDtl?: Array<QGiaDen>;
  listDRFileVM?: Array<FileUploadVM>;
}

export class DoanRa implements IDoanRa {
  constructor(
    public maDoan?: number,
    public tenDoan?: string | null,
    public truongDoan?: string | null,
    public chucVu?: string | null,
    public quocGia?: string | null,
    public mucDichHD?: string | null,
    public ngayNC?: string | null,
    public ngayXC?: string | null,
    public soNgay?: number,
    public noiLuuTru?: string | null,
    public anNinh?: number | null,
    public ghiChu?: string | null,
    public soLuongTV?: number | null,
    public listFile?: FileList | null,
    public createdBy?: string | null,
    public updatedBy?: string | null,
    public createdDate?: Date | null,
    public updatedDate?: Date | null,
    public jsonLanhDao?: Array<LanhDao>,
    public JsonHoSoDtl?: Array<QGiaDen>,
    public listLanhDao?: Array<LanhDao>,
    public listHoSoDtl?: Array<QGiaDen>,
    public listDRFileVM?: Array<FileUploadVM>,
  ) {}
}
