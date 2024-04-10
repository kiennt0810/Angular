export interface IUploadFileView {
    RequestID?: number | null;
    AttachmentFlag?: boolean | null;
    FormType?: string | null;
    AttachmentName?: string | null;
    AttachmentContent?: string | null;
}
export class UploadFileView implements IUploadFileView {
    constructor(
        public RequestID?: number | null,
        public AttachmentFlag?: boolean | null,
        public FormType?: string | null,
        public AttachmentName?: string | null,
        public AttachmentContent?: string | null,
    ){}
}