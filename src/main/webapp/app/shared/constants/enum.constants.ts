/* FOR TEMPLATE */
export enum TemplateStatus {
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished',
}

export enum AuthenType {
  DEFAULT = '0',
  OTP = '1',
  PASSCODE = '2',
  INVISIBLE = '4',
}

/* FOR IMPORT LOT */
export enum ImportDataType {
  NAME_ENVELOPE = 'ne',
  NO_ENVELOPE = 'no',
  SIGN_DATE = 'sd',
  PARTY = 'p',
  RECIPIENT = 'r',
  MAIL = 'm',
  PHONE = 'phone',
  FIELD = 'f',
  FREE_FIELD = 'ff',
  HEADER_FIELD = 'header_fields',

  FPT_CA_FOWARD_CODE = 'fowardCode',
  FPT_CA_ADDRESS = 'address',
  FPT_CA_STATE = 'stateOrProvince',
  FPT_CA_LOCATION = 'location',
  FPT_CA_COMMUNE = 'commune',
  FPT_CA_COUNTRY = 'country',
  FPT_CA_MESSAGE_TYPE = 'messageType',
  FPT_CA_DOCUMENT_TYPE = 'personalDocumentType',
  FPT_CA_PERSONALID = 'personalID',
  FPT_CA_PROVIDE_DATE = 'provideDate',
  FPT_CA_PROVIDE_ADDRESS = 'provideAddress',
  FPT_CA_PHOTO_FRONT = 'photoFrontSideIDCard',
  FPT_CA_PHOTO_BACKSIDE = 'photoBackSideIDCard',
}

/* FOR ENVELOPE */
export enum EnvelopeStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  REJECTED = 'rejected',
  OVERDUE = 'overdue',
  VOIDED = 'voided',
  COMPLETED = 'completed',
}

export enum EnvelopeDecision {
  ACCEPT = 'accepted',
  REJECT = 'rejected',
}

export enum SignType {
  SIGNIMG = 'Sign-IMG',
  PLUGIN = 'sign_plugin',
  FPTOTP = 'sign_fca.otp',
  FPTPASSCODE = 'sign_fca.passcode',
  HSMSIGN = 'sign_hsm_internal',
  SIGNIMG_MUTIL_LAYLER_EMAIL = 'sign_mutil_layer_email',
  VNPTOTP = 'sign_vnpt.otp',
  VNPTPASSCODE = 'sign_vnpt.passcode',
  EKYC = 'sign_ekyc',
}

export enum SignOtpResultCode {
  RES_0 = '0',
  RES_1004 = '1004',
  RES_1005 = '1005',
  RES_1013 = '1013',
  RES_1014 = '1014',
  RES_1015 = '1015',
}

export enum NotifyType {
  SMS = 'sms',
  EMAIL = 'email',
}

/* FOR FIELD */
export const CURRENCY = [
  { value: 'VN', label: 'Việt Nam đồng (VND)', thousand: '.', decimal: ',', prefix: '', suffix: ' ₫' },
  { value: 'US', label: 'USD ($)', thousand: ',', decimal: '.', prefix: '$', suffix: '' },
  { value: 'UK', label: 'Pound (£)', thousand: ',', decimal: '.', prefix: '£', suffix: '' },
  { value: 'GERMANY', label: 'Euro (€)', thousand: ',', decimal: '.', prefix: '', suffix: ' €' },
  { value: 'JAPAN', label: 'Yen (¥)', thousand: ',', decimal: '.', prefix: '¥', suffix: '' },
  { value: 'KOREA', label: 'Won (₩)', thousand: ',', decimal: '.', prefix: '₩', suffix: '' },
];

export const DEFAULT_FIELD_SIZE = {
  image: { h: 45, w: 82 },
  signature: { h: 45, w: 82 },
  text: { h: 24, w: 48 },
  select: { h: 24, w: 48 },
  checkbox: { h: 20, w: 20 },
  currency: { h: 24, w: 48 },
  information: { h: 24, w: 48 },
  headerField: { h: 24, w: 48 },
  radio: { h: 24, w: 48 },
  // date: { h: 100, w: 100 },
  // checkbox: { h: 100, w: 100 },
  // radio: { h: 100, w: 100 }
};
export const LAYOUT_FIELD_SIZE = {
  image: { h: 90, w: 164 },
  signature: { h: 90, w: 164 },
  text: { h: 32, w: 100 },
  select: { h: 55, w: 165 },
  currency: { h: 32, w: 100 },
  information: { h: 32, w: 100 },
  headerField: { h: 32, w: 100 },
  comment: { h: 50, w: 50 },
  checkbox: { h: 50, w: 50 },
  radio: { h: 100, w: 125 },
};
export const BIG_LAYOUT_FIELD_SIZE = {
  signature: { h: 160, w: 320 },
};
export const DEFAULT_FIELD_VALIDATORS = [
  { type: 'required', expression: true },
  { type: 'fixed', expression: false },
];

export enum FieldType {
  IMAGE = 'image',
  SIGNATURE = 'signature',
  HEADER_FIELD = 'headerField',
  TEXT = 'text',
  DATE = 'date',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  CURRENCY = 'currency',
  NAME = 'information',
  COMMENT = 'comment',
  SELECT = 'select',
}

export enum ValidatorType {
  REQUIRED = 'required',
  EMAIL = 'email',
  MIN_VALUE = 'min',
  MAX_VALUE = 'max',
  MIN_LENGTH = 'minLength',
  MAX_LENGTH = 'maxLength',
  FIXED = 'fixed',
}

export const FontType = [
  {
    fontName: 'Times New Roman',
    unicode: true,
    regular: 'TIMES_NEW_ROMAN',
    bold: 'TIMES_NEW_ROMAN_BOLD',
    italic: 'TIMES_NEW_ROMAN_ITALIC',
    boldItalic: 'TIMES_NEW_ROMAN_BOLD_ITALIC',
  },
  {
    fontName: 'Times Roman',
    unicode: false,
    regular: 'TIMES_ROMAN',
    bold: 'TIMES_BOLD',
    italic: 'TIMES_ITALIC',
    boldItalic: 'TIMES_BOLD_ITALIC',
  },
  {
    fontName: 'Courier',
    unicode: false,
    regular: 'COURIER',
    bold: 'COURIER_BOLD',
    italic: 'COURIER_OBLIQUE',
    boldItalic: 'COURIER_BOLD_OBLIQUE',
  },
  {
    fontName: 'Arial',
    unicode: true,
    regular: 'ARIAL',
    bold: 'ARIAL_BOLD',
    italic: 'ARIAL_OBLIQUE',
    boldItalic: 'ARIAL_BOLD_OBLIQUE',
  },
];

export const FontStyle = [
  {
    fontName: 'Times New Roman',
    unicode: true,
    regular: 'TIMES_NEW_ROMAN',
    bold: 'TIMES_NEW_ROMAN_BOLD',
    italic: 'TIMES_NEW_ROMAN_ITALIC',
    boldItalic: 'TIMES_NEW_ROMAN_BOLD_ITALIC',
  },
  {
    fontName: 'Courier',
    unicode: false,
    regular: 'COURIER',
    bold: 'COURIER_BOLD',
    italic: 'COURIER_OBLIQUE',
    boldItalic: 'COURIER_BOLD_OBLIQUE',
  },
  {
    fontName: 'Gluten',
    unicode: true,
    regular: 'GLUTEN',
    bold: 'TIMES_NEW_ROMAN_BOLD',
    italic: 'TIMES_NEW_ROMAN_ITALIC',
    boldItalic: 'TIMES_NEW_ROMAN_BOLD_ITALIC',
  },
  {
    fontName: 'Ephesis',
    unicode: true,
    regular: 'EPHESIS',
    bold: 'TIMES_BOLD',
    italic: 'TIMES_ITALIC',
    boldItalic: 'TIMES_BOLD_ITALIC',
  },
  {
    fontName: 'Birthstone Bounce',
    unicode: true,
    regular: 'BIRTHSTONE_BOUNCE',
    bold: 'TIMES_BOLD',
    italic: 'TIMES_ITALIC',
    boldItalic: 'TIMES_BOLD_ITALIC',
  },
  {
    fontName: 'Open Sans Condensed',
    unicode: true,
    regular: 'OPEN_SANS_CONDENSED',
    bold: 'COURIER_BOLD',
    italic: 'COURIER_OBLIQUE',
    boldItalic: 'COURIER_BOLD_OBLIQUE',
  },
  {
    fontName: 'Gluten',
    unicode: true,
    regular: 'GLUTEN',
    bold: 'COURIER_BOLD',
    italic: 'COURIER_OBLIQUE',
    boldItalic: 'COURIER_BOLD_OBLIQUE',
  },
  {
    fontName: 'Pacifico',
    unicode: true,
    regular: 'PACIFICO',
    bold: 'COURIER_BOLD',
    italic: 'COURIER_OBLIQUE',
    boldItalic: 'COURIER_BOLD_OBLIQUE',
  },
  {
    fontName: 'Caveat',
    unicode: true,
    regular: 'CAVEAT',
    bold: 'COURIER_BOLD',
    italic: 'COURIER_OBLIQUE',
    boldItalic: 'COURIER_BOLD_OBLIQUE',
  },
  {
    fontName: 'Carattere',
    unicode: true,
    regular: 'CARATTERE',
    bold: 'COURIER_BOLD',
    italic: 'COURIER_OBLIQUE',
    boldItalic: 'COURIER_BOLD_OBLIQUE',
  },
  {
    fontName: 'Cardo',
    unicode: true,
    regular: 'CARDO',
    bold: 'COURIER_BOLD',
    italic: 'COURIER_OBLIQUE',
    boldItalic: 'COURIER_BOLD_OBLIQUE',
  },
];

/* FOR HISTORY */
export enum RecipientInfoStatus {
  PROCESSING = 'processing',
  PROCESSING_1 = 'processing_1', // Dang thuc hien theo lo
  REJECTED = 'rejected',
  OVERDUE = 'overdue',
  WAITING = 'waiting',
  ACCEPTED = 'accepted',
  CC = 'cced',
}

export enum HistoryStatus {
  SIGNED = 'signed',
  REVIEWED = 'reviewed',
  STAMPED = 'stamped',
  COORDINATED = 'coordinated',
  CCED = 'cced',
  REJECTED_SIGNING = 'rejected-signing',
  REJECTED_STAMPING = 'rejected-stamping',
  REJECTED_COORDINATING = 'rejected-coordinating',
  REJECTED_REVIEWING = 'rejected-reviewing',
  REJECTED_CC = 'rejected-cc',
  SIGNING = 'signing',
  STAMPING = 'stamping',
  REVIEWING = 'reviewing',
  COORDINATING = 'coordinating',
  CCING = 'cc-ing',
  WAIT_FOR_SIGNING = 'wait-for-signing',
  WAIT_FOR_STAMPING = 'wait-for-stamping',
  WAIT_FOR_REVIEWING = 'wait-for-reviewing',
  WAIT_FOR_COORDINATING = 'wait-for-coordinating',
  WAIT_FOR_CC = 'wait-for-cc',
}

/* FOR NOTIFICATION */
export enum NotificationStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  REJECTED = 'rejected',
  OVERDUE = 'overdue',
  VOIDED = 'voided',
  COMPLETED = 'completed',
  WAITING = 'waiting',
  ACCEPTED = 'accepted',
  FORWARDED = 'forwarded',
  DELEGATED = 'delegated',
  PROCESSING_1 = 'processing_1', // Dang cho ky lo
}

export enum NotificationStatusMapped {
  DRAFT = 'draft',
  WAITING_OTHERS = 'waiting-others',
  FORWARDED = 'forwarded',
  DELEGATED = 'delegated',
  REJECTED = 'rejected',
  OVERDUE = 'overdue',
  VOIDED = 'voided',
  COMPLETED = 'completed',
  DELETED = 'deleted',
  NEED_SIGN = 'need-sign',
  NEED_STAMPING = 'need-stamping',
  NEED_REVIEW = 'need-review',
  NEED_COORDINATOR = 'need-coordinator',
  PROCESSING = 'processing',
  PROCESSING_1 = 'processing_1', // Dang cho thuc hien lo
  PROCESSING_SIGN = 'processing-sign',
  PROCESSING_REVIEW = 'processing-review',
  PROCESSING_COORDINATOR = 'processing-coordinator',
  PROCESSING_STAMPER = 'processing-stamper',
  PROCESSING_1008 = 'processing_1008',
  PROCESSING_1004 = 'processing_1004',
  PROCESSING_1005 = 'processing_1005',
  PROCESSING_1003 = 'processing_1003',
  PROCESSING_1013 = 'processing_1013',
  PROCESSING_1014 = 'processing_1014',
  PROCESSING_1015 = 'processing_1015',
  PROCESSING_1033 = 'processing_1033',
  PROCESSING_ERR = 'processing_error',
  SIGN_LOT_ERROR = 'sign_lot_error',
}

/* FOR RECIPIENT */
export enum SystemUser {
  SYS = 'sys',
  ANO = 'ano',
}

/* FOR RECIPIENT */
export enum RecipientRole {
  SIGNER = 'signer',
  COORDINATOR = 'coordinator',
  REVIEWER = 'reviewer',
  STAMPER = 'stamper',
  CC = 'cc',
}

export enum RecipientStatus {
  OVERDUE = 'overdue',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PROCESSING = 'processing',
}

/* FOR SIGN FLOW */
export enum SignFlowType {
  PREDEFINED = 'predefined',
  PARTY_DEFINE = 'party-define',
}

/* FOR PARTY */
export enum PartyType {
  INDIVIDUAL = 'individual',
  ORGANIZATION = 'organization',
  MY_ORGANIZATION = 'my-organization',
  REPRESENTATIVE = 'representative',
  TRUSTED_ORGANIZATION = 'trusted-organization',
}

export const COLORS: string[] = [
  '#FFAE09',
  '#FF4A40',
  '#44AF69',
  '#330099',
  '#336633',
  '#3399FF',
  '#3399FF',
  '#663333',
  '#6666FF',
  '#66CC99',
  '#990033',
  '#9933FF',
  '#999999',
  '#99FF33',
  '#CC00FF',
  '#CC6699',
  '#CCCC33',
  '#CCFFFF',
  '#FF3399',
  '#FF9933',
  '#FFCCFF ',
  '#003366',
  '#009900',
  '#00CCCC',
  '#330066',
  '#336600',
  '#3399CC',
  '#33FF66',
  '#663300',
  '#6666CC',
  '#66CC66',
  '#990000',
  '#9933CC',
  '#999966',
  '#99FF00',
  '#CC00CC',
  '#CC6666',
  '#CCCC00',
  '#CCFFCC',
  '#FF3366',
  '#FF9900',
  '#FFCCCC',
  '#003333',
  '#0066FF',
  '#00CC99',
  '#330033',
  '#3333FF',
  '#339999',
  '#33FF33',
  '#6600FF',
  '#666699',
  '#66CC33',
  '#66FFFF',
  '#993399',
  '#999933',
  '#99CCFF',
  '#CC0099',
  '#CC6633',
  '#CC99FF',
  '#CCFF99',
  '#FF3333',
  '#FF66FF',
  '#FFCC99',
  '#003300',
  '#0066CC',
  '#00CC66',
  '#330000',
  '#3333CC',
  '#339966',
  '#33FF00',
  '#6600CC',
  '#666666',
  '#66CC00',
  '#66FFCC',
  '#993366',
  '#999900',
  '#99CCCC',
  '#CC0066',
  '#CC6600',
  '#CC99CC',
  '#CCFF66',
  '#FF3300',
  '#FF66CC',
  '#FFCC66',
  '#0000FF',
  '#006699',
  '#00CC33',
  '#00FFFF',
  '#333399',
  '#339933',
  '#33CCFF',
  '#660099',
  '#666633',
  '#6699FF',
  '#66FF99',
  '#993333',
  '#9966FF',
  '#99CC99',
  '#CC0033',
  '#CC33FF',
  '#CC9999',
  '#CCFF33',
  '#FF00FF',
  '#FF6699',
  '#FFCC33',
  '#0000CC',
  '#006666',
  '#00CC00',
  '#00FFCC',
  '#333366',
  '#339900',
  '#33CCCC',
  '#660066',
  '#666600',
  '#6699CC',
  '#66FF66',
  '#993300',
  '#9966CC',
  '#99CC66',
  '#CC0000',
  '#CC33CC',
  '#CC9966',
  '#CCFF00',
  '#FF00CC',
  '#FF6666',
  '#FFCC00',
  '#000099',
  '#006633',
  '#0099FF',
  '#00FF99',
  '#333333',
  '#3366FF',
  '#33CC99',
  '#660033',
  '#6633FF',
  '#669999',
  '#66FF33',
  '#9900FF',
  '#996699',
  '#99CC33',
  '#99FFFF',
  '#CC3399',
  '#CC9933',
  '#CCCCFF',
  '#FF0099',
  '#FF6633',
  '#FF99FF',
  '#000066',
  '#006600',
  '#0099CC',
  '#00FF66',
  '#333300',
  '#3366CC',
  '#33CC66',
  '#660000',
  '#6633CC',
  '#669966',
  '#66FF00',
  '#9900CC',
  '#996666',
  '#99CC00',
  '#99FFCC',
  '#CC3366',
  '#CC9900',
  '#CCCCCC',
  '#FF0066',
  '#FF6600',
  '#FF99CC',
  '#000033',
  '#0033FF',
  '#009999',
  '#00FF33',
  '#3300FF',
  '#336699',
  '#33CC33',
  '#33FFFF',
  '#663399',
  '#669933',
  '#66CCFF',
  '#990099',
  '#996633',
  '#9999FF',
  '#99FF99',
  '#CC3333',
  '#CC66FF',
  '#CCCC99',
  '#FF0033',
  '#FF33FF',
  '#FF9999',
  '#000000',
  '#0033CC',
  '#009966',
  '#00FF00',
  '#3300CC',
  '#336666',
  '#33CC00',
  '#33FFCC',
  '#663366',
  '#669900',
  '#66CCCC',
  '#990066',
  '#996600',
  '#9999CC',
  '#99FF66',
  '#CC3300',
  '#CC66CC',
  '#CCCC66',
  '#FF0000',
  '#FF33CC',
  '#FF9966',
];
