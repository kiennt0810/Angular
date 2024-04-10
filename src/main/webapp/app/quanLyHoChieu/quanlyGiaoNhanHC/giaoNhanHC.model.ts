import { JsonPipe } from "@angular/common";
import { HoChieuNgoaiGiao } from "../quanlyHCNgoaiGiao/hoCNgoaiGiao.model";

export interface IGiaoNhanHC {
  id: number | null;
  soHoChieu?: string | null;
  ghcThoiGian?: string | null;
  ghcNguoiGiao?: string | null;
  ghcNguoiNhan?: string | null;
  nhcThoiGian?: string | null;
  nhcNguoiGiao?: string | null;
  nhcNguoiNhan?: string | null;
  hcNgoaiGiaoVM?: HoChieuNgoaiGiao | null;

  hoTen?: string | null;
  chucVu?: string | null;
  coQuan?: string | null;
  loaiHC?: string | null;
  stt?: number | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

export class GiaoNhanHC implements IGiaoNhanHC {
  constructor(
    public id: number | null,
    public soHoChieu?: string | null,
    public ghcThoiGian?: string | null,
    public ghcNguoiGiao?: string | null,
    public ghcNguoiNhan?: string | null,
    public nhcThoiGian?: string | null,
    public nhcNguoiGiao?: string | null,
    public nhcNguoiNhan?: string | null,
    public hcNgoaiGiaoVM?: HoChieuNgoaiGiao | null,
    public hoTen?: string | null,
    public chucVu?: string | null,
    public coQuan?: string | null,
    public loaiHC?: string | null,
    public stt?: number | null,
    public createdBy?: string | null,
    public updatedBy?: string | null,
  ) {}
}
