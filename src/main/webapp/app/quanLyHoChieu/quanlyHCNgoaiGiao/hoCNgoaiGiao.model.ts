import { FileUploadHC } from "./file-HC.model";

export interface IHoChieuNgoaiGiao {
    id: number | null;
    soHC?: string | null;
    loaiHC?: string | null;
    hoTen?: string | null;
    quocTich?: string | null;
    gioiTinh?: string | null;
    ngaySinh?: string | null;
    noiSinh?: string | null;
    cmndSo?: string | null;
    cmndNgayCap?: string | null;
    cmndNgayHL?: string | null;
    cmndNoiCap?: string | null;
    dataHC?: string | null;
    anhHC?: string | null;
    fileHoSo?: FileList | null;
    chucVu?: string | null;
    coQuan?: string | null;
    tGianHetHan? :  number | null;
    trangThai? : string | null;
    imgFile?: File | null;
    listHCFileVM?: Array<FileUploadHC>;
    stt?: number | null;
    createdBy?: string | null;
  }
  
  export class HoChieuNgoaiGiao implements IHoChieuNgoaiGiao {
    constructor(
      public id: number | null,
      public soHC?: string | null,
      public loaiHC?: string | null,
      public hoTen?: string | null,
      public quocTich?: string | null,
      public gioiTinh?: string | null,
      public ngaySinh?: string | null,
      public noiSinh?: string | null,
      public cmndSo?: string | null,
      public cmndNgayCap?: string | null,
      public cmndNgayHL?: string | null,
      public cmndNoiCap?: string | null,
      public dataHC?: string | null,
      public anhHC?: string | null,
      public fileHoSo?: FileList | null,
      public chucVu?: string | null,
      public coQuan?: string | null,
      public trangThai?: string | null,
      public tGianHetHan?: number | null,
      public imgFile?: File | null,
      public listHCFileVM?: Array<FileUploadHC>,
      public stt?: number | null,
      public createdBy?: string | null
    ) {}
  }
  