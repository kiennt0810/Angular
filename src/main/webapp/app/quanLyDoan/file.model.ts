export interface IFileUploadVM {
    id?: number | null;
    fileName?: string | null;
    maHSDoan?: number | null;
    type?: number | null;
}
export class FileUploadVM implements IFileUploadVM {
    constructor(
        public id?: number | null,
        public fileName?: string | null,
        public maHSDoan?: number | null,
        public type?: number | null,
    ){}
}