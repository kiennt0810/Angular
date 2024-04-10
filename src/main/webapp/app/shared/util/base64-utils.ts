export class Base64Util {
  static getBase64(str: string): string {
    return Buffer.from(str).toString('base64');
  }

  static getString(base64: string): string {
    let buff = new Buffer(base64, 'base64');
    return buff.toString('ascii');
  }
}
