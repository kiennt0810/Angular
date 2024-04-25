export interface IStorage {
    id: number | null;
    dungLuong?: string | null;
    trangThai?: boolean;
    createdBy?: string | null;
    updatedBy?: string | null;
}

export class Storage implements IStorage {
    constructor(
        public id: number | null,
        public dungLuong?: string | null,
        public trangThai?: boolean,
        public createdBy?: string | null,
        public updatedBy?: string | null,
    ) { }
}
