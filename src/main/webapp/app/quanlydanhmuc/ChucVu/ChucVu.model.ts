export interface IChucVu {
    id: number | null;
    chucVu?: string | null;
    coQuan?: string | null;
    tinhTrang?: boolean;
    createdBy?: string | null;
    updatedBy?: string | null;
}

export class ChucVu implements IChucVu {
    constructor(
        public id: number | null,
        public chucVu?: string | null,
        public coQuan?: string | null,
        public tinhTrang?: boolean,
        public createdBy?: string | null,
        public updatedBy?: string | null,
    ) { }
}
