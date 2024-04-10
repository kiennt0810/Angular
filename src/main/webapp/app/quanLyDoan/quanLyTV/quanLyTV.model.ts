import { BlobOptions } from "buffer";
import { FileUploadVM } from "../file.model";
import { DelegationIn } from "../quanLyDoanVao/doanVao.model";

export interface IQuanLyTV {
    soTT?: number | null;
    ckSoTT?: boolean | null;
    maTV?: string | null;
    maHSDoan?: string | null;
    tenHSDoan?: string | null;
    coQuan?: string | null;
    chucVu?: string | null;
    hoTen?: string | null;
    hoTenPA?: string | null;
    gioiTinh?: boolean | null;
    ngaySinh?: string | null;
    maQG?: string | null;
    quocGia?: string | null;
    noiLuuTru?: string | null;
    ngayNC?: string | null;
    ngayXC?: string | null;
    tinhTrangSK?: string | null;
    tangPham?: string | null;
    soHoChieu?: string | null;
    hC_NgayCap?: string | null;
    hC_NgayHL?: string | null;
    hC_Loai?: string | null;
    hC_SoThiThuc?: string | null;
    hC_NgayCapTT?: string | null;
    listFile?: FileList | null;
    fileHoChieu?: string | null;
    listTVFileVM?: Array<FileUploadVM>;
    strLsFileDelete?: string | null;
    fileUpList?: File[] | null;
    fileHC?: File | null
  dvHoSoVM?: DelegationIn;
  createdBy?: string | null;
    updatedBy?: string | null;
  }
  
  export class QuanLyTV implements IQuanLyTV {
    constructor(
      public soTT?: number | null,
      public ckSoTT?: boolean | null,
      public maTV?: string | null,
      public maHSDoan?: string | null,
      public tenHSDoan?: string | null,
      public coQuan?: string | null,
      public chucVu?: string | null,
      public hoTen?: string | null,
      public hoTenPA?: string | null,
      public gioiTinh?: boolean | null,
      public ngaySinh?: string | null,
      public maQG?: string | null,
      public quocGia?: string | null,
      public noiLuuTru?: string | null,
      public ngayNC?: string | null,
      public ngayXC?: string | null,
      public tinhTrangSK?: string | null,
      public tangPham?: string | null,
      public soHoChieu?: string | null,
      public hC_NgayCap?: string | null,
      public hC_NgayHL?: string | null,
      public hC_Loai?: string | null,
      public hC_SoThiThuc?: string | null,
      public hC_NgayCapTT?: string | null,
      public listFile?: FileList | null,
      public fileHoChieu?: string | null,
      public listTVFileVM?: Array<FileUploadVM>,
      public strLsFileDelete?: string | null,
      public fileUpList?: File[] | null,
      public fileHC?: File | null,
      public dvHoSoVM?: DelegationIn,
      public createdBy?: string | null,
      public updatedBy?: string | null,
    ) {}
  }
  