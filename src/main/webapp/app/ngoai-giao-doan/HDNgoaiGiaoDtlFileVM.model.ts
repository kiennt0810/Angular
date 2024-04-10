export interface IHDNgoaiGiaoDtlFileVM {
    id?: number | null;
    fileName?: string |null;
    hdrID?: string | null;
    contentType?: string | null;
    type?: number | null;

  }
  
  export class HDNgoaiGiaoDtlFileVM implements IHDNgoaiGiaoDtlFileVM {
    constructor(
    public id?: number | null,
    public fileName?: string |null,
    public hdrID?: string | null,
    public contentType?: string | null,
    public type?: number | null,
    ) {}
  }
  