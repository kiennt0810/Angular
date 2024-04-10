export interface IFileUploadHC {
    id?: number | null;
    fileName?: string | null;
    type?: number | null;
}
export class FileUploadHC implements IFileUploadHC {
    constructor(
        public id?: number | null,
        public fileName?: string | null,
        public type?: number | null,
    ){}
}