export interface IBrand {
    id: number | null;
    thuongHieu?: string | null;
    trangThai?: boolean;
    createdBy?: string | null;
    updatedBy?: string | null;
}

export class Brand implements IBrand {
    constructor(
        public id: number | null,
        public thuongHieu?: string | null,
        public trangThai?: boolean,
        public createdBy?: string | null,
        public updatedBy?: string | null,
    ) { }
}
