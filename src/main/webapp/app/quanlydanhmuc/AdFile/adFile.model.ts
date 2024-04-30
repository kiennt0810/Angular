import { FileImg } from "./fileImg.model";

export interface IAdFile {
    id?: number | null;
    fileImg?: FileList | null,
    listAdFileVM?: Array<FileImg>,
}

export class AdFile implements IAdFile {
    constructor(
        public id: number | null,
        public fileImg?: FileList | null,
        public listAdFileVM?: Array<FileImg>,
    ) {}
}
