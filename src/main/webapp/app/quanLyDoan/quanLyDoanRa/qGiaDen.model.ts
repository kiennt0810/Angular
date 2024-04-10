export interface IQGiaDen {
    iD?: number | null;
    maHSDoan?: number | null;
    maQG?: string | null;
    quocGia?: string | null;
    chuongTrinhHD?: string | null;
    noiLuuTru?: string | null;
    soNgayLuuTru?: number | null;
    soLuongTV?: number | null;
}

export class QGiaDen implements IQGiaDen {
    constructor(
        public iD?: number | null,
        public maHSDoan?: number | null,
        public maQG?: string | null,
        public quocGia?: string | null,
        public chuongTrinhHD?: string | null,
        public noiLuuTru?: string | null,
        public soNgayLuuTru?: number | null,
        public soLuongTV?: number | null,
    ){}
}