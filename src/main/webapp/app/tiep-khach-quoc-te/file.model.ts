export interface IFileUploadVM {
    id?: number | null;
    fileName?: string | null;
    data?: string | null;
    type?: number | null;
    contentType?: string | null;
    idThanhVienTKQT?: number | null;
}
export class FileUploadVM implements IFileUploadVM {
    constructor(
        public id?: number | null,
        public fileName?: string | null,
        public data?: string | null,
        public type?: number | null,
        public contentType?: string | null,
        public idThanhVienTKQT?: number | null,
    ){}
}