// These constants are injected via webpack DefinePlugin variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application

declare const __DEBUG_INFO_ENABLED__: boolean;
declare const __VERSION__: string;

export const VERSION = __VERSION__;
export const DEBUG_INFO_ENABLED = __DEBUG_INFO_ENABLED__;
export const MAXFILESIZEUPLOAD = 10;
export const FILE_ACCEPT_PDF = 'application/pdf';
// 'application/msword,image/*,.xlsx,.xls, application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text, application/msword,  application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/pdf';

export const PAGE_MARGIN_BOTTOM = 10;
export const PAGE_PADDING_LEFT = 7;
export const CSS_UNIT = 96.0 / 72.0;
export const LANG_KEY = 'lan';
export const API_URL = 'https://localhost:7253';
//export const API_URL = 'http://letan.bdntw.dcs.vn:8081';
export const SESSION_TIMEOUT = 3000;
export const THOI_GIAN_HIEU_LUC = 180;

