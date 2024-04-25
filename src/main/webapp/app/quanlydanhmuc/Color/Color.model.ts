export interface IColor {
    id: number | null;
    maMau?: string | null;
    trangThai?: boolean;
    createdBy?: string | null;
    updatedBy?: string | null;
}

export class Color implements IColor {
    constructor(
        public id: number | null,
        public maMau?: string | null,
        public trangThai?: boolean,
        public createdBy?: string | null,
        public updatedBy?: string | null,
    ) { }
}
