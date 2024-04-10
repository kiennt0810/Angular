import { Injectable } from '@angular/core';

@Injectable()
export class AlertServiceCheck {

  public alerts = [];

  constructor() { }

  public success(message: string) {
    this.show(message, 'success');
  }

  public error(message: string) {
    this.show(message, 'error');
  }

  public warn(message: string) {
    this.show(message, 'warn');
  }

  public info(message: string) {
    this.show(message, 'info');
  }

  public show(content: string, style = 'info') {
    const a = { style, content, timeout: null }
    this.alerts.push(a);

    a.timeout = setTimeout(() => {
      this.remove(a);
      console.log(this.alerts);
    }, 3000);
  }

  remove(alert: any) {
    clearTimeout(alert.timeout);
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

}