export class BaseException extends Error {
  constructor(message, status) {
    super(message);
    this.isException = true;
    this.status = status;
  }
}
