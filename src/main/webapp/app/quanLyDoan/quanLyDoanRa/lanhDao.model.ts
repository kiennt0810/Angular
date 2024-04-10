export interface ILanhDao {
    iD?: number | null;
    maHSDoan?: number | null;
    hoTen?: string | null;
}

export class LanhDao implements ILanhDao {
    constructor(
        public iD?: number | null,
        public maHSDoan?: number | null,
        public hoTen?: string | null,
    ){}
}