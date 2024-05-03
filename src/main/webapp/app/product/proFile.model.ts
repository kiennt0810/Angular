export interface IProFile {
    id?: number | null;
    imgUrl?: string | null;
    idProduct?: number | null;
}
export class ProFile implements IProFile {
    constructor(
        public id?: number | null,
        public imgUrl?: string | null,
        public idProduct?: number | null,
    ){}
}