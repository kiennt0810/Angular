export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
export const DATE_TIME_FORMAT_1 = 'YYYY-MM-DD HH:mm';
export const FILE_ACCEPT =
  'application/msword,image/*,.xlsx,.xls, application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text, application/msword,  application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/pdf';
export const FILE_ACCEPT_EXPAND =
  'application/vnd.ms-excel,image/*, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/rar, application/x-rar-compressed, multipart/x-rar,application/zip, application/x-zip-compressed, multipart/x-zip,application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text, application/msword,  application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/pdf';
export const EXCEL_FILE_ACCEPT = 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
export const MAX_SIGNATURE_SIZE = 1048576 * 2; // byte 1000K
export const MAX_DOCUMENT_SIZE = 1048576 * 3; // byte 3M
export const MAX_LOT_SIZE = 200;
export const REGEXP_EMAIL = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
// export const REGEXP_EMAIL = new RegExp(
//   /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
// );
export const REGEXP_DATE = new RegExp(
  /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
);
export const REGEX_MST = '^[0-9]{10}$|^[0-9]{10}\\-[0-9]{3}$';
export const REGEX_MSTM10 = '^[0-9]{10}\\-[0-9]{3}$';
export const REGEX_PHONENUMBER = '^[0-9]{8,12}$|^[+]{1}[0-9]{8,11}$';
export const REGEX_EMAIL_TEM = '^[a-zA-Z0-9_-]+@[a-zA-Z]+(.[a-zA-Z]{2,}){1,2}$';
export const REGEX_DATE_TIME = new RegExp('^([0-2][0-9]|(3)[0-1])(/)(((0)[0-9])|((1)[0-2]))(/)d{4}$');
export const REGEX_IS_NUMBER = new RegExp('^[+-]?[0-9]+(.[0-9]*)?$');
export const REGEX_IS_FLOAT = new RegExp('^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$');
export const REGEX_PASSWORD = new RegExp(/^(?=.*[0-9])(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{10,32}$/);
export const REGEX_DIGIT = new RegExp(/.*[0-9].*/);
export const REGEX_LOWERCASE_CHAR = new RegExp(/.*[a-z].*/);
export const REGEX_UPPERCASE_CHAR = new RegExp(/.*[A-Z].*/);
export const REGEX_SPECIAL_CHAR = new RegExp(/.*[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\\\|\;\:\'\"\,\<\.\>\/\?].*/);
export const REGEX_MIN_LENGTH = new RegExp(/.{4,}/);
