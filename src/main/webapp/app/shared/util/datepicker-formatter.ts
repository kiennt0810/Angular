import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('/');
      if (dateParts.length === 3 && this.isNumber(dateParts[0]) && this.isNumber(dateParts[1]) && this.isNumber(dateParts[2])) {
        return { year: this.toInteger(dateParts[2]), month: this.toInteger(dateParts[1]), day: this.toInteger(dateParts[0]) };
      }
    }
    return null;
  }

  format(date: NgbDateStruct): string {
    let stringDate: string = '';
    if (date) {
      stringDate += this.isNumber(date.day) ? this.padNumber(date.day) + '/' : '';
      stringDate += this.isNumber(date.month) ? this.padNumber(date.month) + '/' : '';
      stringDate += date.year;
    }
    return stringDate;
  }

  private padNumber(value: number) {
    if (this.isNumber(value)) {
      return `0${value}`.slice(-2);
    } else {
      return '';
    }
  }

  private isNumber(value: any): boolean {
    return !isNaN(this.toInteger(value));
  }

  private toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }
}

@Injectable()
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {
  fromModel(date: Date): NgbDateStruct {
    return date && date.getFullYear ? { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } : null;
  }

  toModel(date: NgbDateStruct): Date {
    return date ? new Date(date.year, date.month - 1, date.day) : null;
  }
}
