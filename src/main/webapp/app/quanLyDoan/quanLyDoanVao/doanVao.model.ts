import { DiaPhuong } from "./diaPhuong.model";
import { FileUploadVM } from "../file.model";
import { LanhDao } from "./lanhDao.model";

export interface IDelegationIn {
  stt?: number | null;
  maDoan?: string;
  tenDoan?: string | null;
  truongDoan?: string | null;
  maQG?: string | null;
  quocGia?: string | null;
  mucDichHD?: string | null;
  ngayNC?: string | null ;
  ngayXC?: string | null;
  soNgay?: number;
  noiLuuTru?: string | null;
  anNinh?: string | null;
  ghiChu?: string | null;
  soLuongTV?: number | null;
  listFile?: FileList | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdDate?: Date | null;
  updatedDate?: Date | null;
  jsonLanhDao?: Array<LanhDao>;
  jsonHDTaiDP?: Array<DiaPhuong>;
  listLanhDao?: Array<LanhDao>;
  listHDTaiDP?: Array<DiaPhuong>;
  listDVFileVM?: Array<FileUploadVM>;
}

export class DelegationIn implements IDelegationIn {
  constructor(
    public stt?: number | null,
    public maDoan?: string,
    public tenDoan?: string | null,
    public truongDoan?: string | null,
    public maQG?: string | null,
    public quocGia?: string | null,
    public mucDichHD?: string | null,
    public ngayNC?: string | null,
    public ngayXC?: string | null,
    public soNgay?: number,
    public noiLuuTru?: string | null,
    public anNinh?: string | null,
    public ghiChu?: string | null,
    public soLuongTV?: number | null,
    public listFile?: FileList | null,
    public createdBy?: string | null,
    public updatedBy?: string | null,
    public createdDate?: Date | null,
    public updatedDate?: Date | null,
    public jsonLanhDao?: Array<LanhDao>,
    public jsonHDTaiDP?: Array<DiaPhuong>,
    public listLanhDao?: Array<LanhDao>,
    public listHDTaiDP?: Array<DiaPhuong>,
    public listDVFileVM?: Array<FileUploadVM>,
  ) {}
}
