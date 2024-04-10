export interface IDiaPhuong {
    iD?: number | null;
    maHSDoan?: number | null;
    diaPhuong?: string | null;
    tuNgay?: Date | null;
    denNgay?: Date | null;
}

export class DiaPhuong implements IDiaPhuong {
    constructor(
        public iD?: number | null,
        public maHSDoan?: number | null,
        public diaPhuong?: string | null,
        public tuNgay?: Date | null,
        public denNgay?: Date | null,
    ){}
}