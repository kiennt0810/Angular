export interface IFileImg {
    id?: number | null;
    fileName?: string | null;
    type?: number | null;
}

export class FileImg implements IFileImg {
    constructor(
        public id: number | null,
        public fileName?: string | null,
        public type?: number | null,
    ) {}
}
