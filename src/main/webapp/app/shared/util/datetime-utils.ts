import { isNullOrUndefined } from './func-util';

export function getCurrentDate(): string {
  const today = new Date();
  let dd: any = today.getDate();

  let mm: any = today.getMonth() + 1;
  const yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }
  return dd + '/' + mm + '/' + yyyy;
}

/**
 * This method fomart string to date (dd/mm/yyyy)
 * @param date
 */
export function fomartDate(date: string): string {
  let d: Date;
  if (isNullOrUndefined(date)) {
    d = new Date();
  } else {
    d = new Date(date);
  }
  let day = '' + d.getDate();
  if (day.length === 1) {
    day = 0 + day;
  }
  let month = '' + (d.getMonth() + 1);
  if (month.length === 1) {
    month = 0 + month;
  }
  let year = d.getFullYear();
  return day + '/' + month + '/' + year;
}
