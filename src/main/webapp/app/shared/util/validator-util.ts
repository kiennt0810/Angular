import { ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import {
  REGEX_MST,
  REGEX_MSTM10,
  REGEX_PHONENUMBER,
  REGEXP_EMAIL,
  REGEX_EMAIL_TEM,
  REGEX_DATE_TIME,
  REGEX_IS_NUMBER,
  REGEX_IS_FLOAT,
  REGEX_PASSWORD,
} from '../constants/input.constants';
import { isNullOrEmpty, isNullOrUndefined } from 'app/shared/util/func-util';
import { SignType } from '../constants';

export function mustNumber(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value !== null) {
      return isNaN(value) ? { mustNumber: { invalid: true } } : null;
    }
    return null;
  };
}

/**
 * Validate tax code
 * @author phuclv6
 * @since 2020/04/13
 */
export function isTaxcode(c: FormControl) {
  const value = c.value;
  if (isNullOrUndefined(value) || value === '') {
    return null;
  } else {
    if (new RegExp(REGEX_MST).test(value) === false) {
      return { isTaxcode: { invalid: true } };
    }
    const ms1 = +value.substring(0, 1);
    const ms2 = +value.substring(1, 2);
    const ms3 = +value.substring(2, 3);
    const ms4 = +value.substring(3, 4);
    const ms5 = +value.substring(4, 5);
    const ms6 = +value.substring(5, 6);
    const ms7 = +value.substring(6, 7);
    const ms8 = +value.substring(7, 8);
    const ms9 = +value.substring(8, 9);
    const ms10 = +value.substring(9, 10);
    const a = 31 * ms1 + 29 * ms2 + 23 * ms3 + 19 * ms4 + 17 * ms5 + 13 * ms6 + 7 * ms7 + 5 * ms8 + 3 * ms9;
    if (ms10 !== 10 - (a % 11)) {
      return { isTaxcode: { invalid: true } };
    }
    if (new RegExp(REGEX_MSTM10).test(value) === true) {
      const ms11to13 = +value.substring(11, 14);
      if (ms11to13 < 1) {
        return { isTaxcode: { invalid: true } };
      }
    }
    return null;
  }
}

export function passwordValidator(control: FormControl) {
  const value = control.value;
  if (isNullOrUndefined(value) || value === '') {
    return { required: { invalid: true } };
  }
  console.log(REGEX_PASSWORD.test(value));
  if (REGEX_PASSWORD.test(value) === false) {
    return { notComplexEnough: { invalid: true } };
  }
  return null;
}

export function customValidator(key: string, nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!isNullOrUndefined(value) && value !== '' && nameRe.test(value) === false) {
      return { [key]: { invalid: true } };
    } else {
      return null;
    }
  };
}

export function ocrValidator(key: string, nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value.toLowerCase();
    if (!isNullOrUndefined(value) && value !== '' && nameRe.test(value) === false) {
      return { [key]: { invalid: true } };
    } else {
      return null;
    }
  };
}

/**
 * noWhitespaceValidator
 * @author phuclv6
 * @since 2020/04/14
 */
export function noWhitespaceValidator(control: FormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { noWhitespaceValidator: { invalid: true } };
}

/**
 * isOver18YearsOld
 * @author phuclv6
 * @since 2020/04/14
 */
export function isOver18YearsOld(control: FormControl) {
  const value = control.value;
  if (
    (REGEX_DATE_TIME.test(value) === false && ('' + value).includes('/')) ||
    (REGEX_DATE_TIME.test(value) === false && ('' + value).includes('-'))
  ) {
    return null;
  } else {
    const birthDayOfRegister = new Date(value).getTime();
    const dateNow = new Date();
    const validDate = dateNow.setFullYear(dateNow.getFullYear() - 18);
    if (birthDayOfRegister > validDate) {
      return { isOver18YearsOld: { invalid: true } };
    } else {
      return null;
    }
  }
}

/**
 * isPhoneNumber
 * @author phuclv6
 * @since 2020/04/14
 */
export function isPhoneNumber(control: FormControl) {
  const value = control.value;
  if (isNullOrUndefined(value) || value === '') {
    return { required: { invalid: true } };
  }
  if (new RegExp(REGEX_PHONENUMBER).test(value) === false) {
    return { isPhoneNumber: { invalid: true } };
  }
  return null;
}

/**
 * isEmail
 * @author phuclv6
 * @since 2020/04/14
 */
export function isEmail(control: FormControl) {
  const value = control.value;
  if (isNullOrUndefined(value) || value === '') {
    return { required: { invalid: true } };
  }
  if (REGEXP_EMAIL.test(value) === false) {
    return { isEmail: { invalid: true } };
  }
  return null;
}

/**
 * isEmail
 * @author phuclv6
 * @since 2020/04/14
 */
export function isEmailOnly(control: FormControl) {
  const value = control.value;
  if (isNullOrUndefined(value) || value === '') {
    return null;
  }
  if (REGEXP_EMAIL.test(value) === false) {
    return { isEmailOnly: { invalid: true } };
  }
  return null;
}

export function isPhoneNumberOnly(control: FormControl) {
  const value = control.value;
  if (isNullOrUndefined(value) || value === '') {
    return null;
  }
  if (new RegExp(REGEX_PHONENUMBER).test(value) === false) {
    return { isPhoneNumberOnly: { invalid: true } };
  }
  return null;
}

/**
 * isNumber
 * @author phuclv6
 * @since 2020/04/14
 */
export function isNumberOnly(control: FormControl) {
  const value = control.value;
  if (isNullOrUndefined(value) || value === '') {
    return null;
  }
  if (REGEX_IS_NUMBER.test(value) === false) {
    return { isNumberOnly: { invalid: true } };
  }
  return null;
}

export function isFloat(control: FormControl) {
  const value = control.value;
  // if (isNullOrUndefined(value) || value === '') {
  //   return { required: { invalid: true } };
  // }
  if (!isNullOrUndefined(value) && value !== '') {
    if (REGEX_IS_FLOAT.test(value) === false) {
      return { isNumber: { invalid: true } };
    } else {
      return null;
    }
  }
  return null;
}

export function isPositiveNumber(control: FormControl) {
  const value = control.value;
  if (value < 0) {
    return { isPositiveNumber: { invalid: true } };
  }
  return null;
}

export function isPositiveNumber1(control: FormControl) {
  const value = control.value;
  if (!isNullOrUndefined(value) && value !== '') {
    if (value <= 0) {
      return { isPositiveNumber1: { invalid: true } };
    }
  } else {
    return null;
  }
  return null;
}

export function isIntegerNumber(control: FormControl) {
  const value = control.value;
  if (!isNullOrUndefined(value) && value !== '') {
    if (Number.isInteger(+value) === false) {
      return { isIntegerNumber: { invalid: true } };
    }
  } else {
    return null;
  }
  return null;
}

// /**
//  * Fomart date mm/DD/yyyy
//  * @author phuclv6
//  * @since 2020/04/14
//  */
// export function isMatchDatePattern(control: FormControl) {
//   const value = control.value;
//   if (isNullOrUndefined(value)) {
//     return null;
//   } else {
//     if (REGEX_DATE_TIME.test(value) === false) {
//       return { dateFomart: { invalid: true } };
//     } else {
//       return null;
//     }
//   }
// }

export function hasRightImageAndDigitalSign(control: FormControl) {
  const value = control.value;
  if (value === null || value === true) {
    return null;
  } else {
    return { hasImageAndDigitalSign: { invalid: true } };
  }
}

export function isPasswordMinLengthValid(min: number) {
  return (control: FormControl): ValidationErrors | null => {
    if (control.value >= min) {
      return null;
    } else {
      return { isPasswordMinLengthValid: { invalid: true } };
    }
  };
}

export function isPasswordRemindAndResetDateValid(min: number, max: number) {
  return (control: FormControl): ValidationErrors | null => {
    if (control.value >= min && control.value <= max) {
      return null;
    } else {
      return { isPasswordRemindAndResetDateValid: { invalid: true } };
    }
  };
}

export function customSignTypesValidator(control: FormControl) {
  if (!isNullOrEmpty(control.value) && control.value.length === 1 && control.value[0] === 'sign_ekyc') {
    return { signEkycHateAlone: { invalid: true } };
  } else if (!isNullOrEmpty(control.value) && isSignFptCaOtpValid(control.value)) {
    return { signFptCaOtpNeedEkyc: { invalid: true } };
  } else {
    return null;
  }
}

function isSignFptCaOtpValid(signTypes: any[]) {
  const signFptCaOtp = signTypes.find(f => f === SignType.FPTOTP);
  const signEkyc = signTypes.find(f => f === SignType.EKYC);
  return !isNullOrUndefined(signFptCaOtp) && isNullOrUndefined(signEkyc);
}
