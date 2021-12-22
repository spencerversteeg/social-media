import HttpException from './HttpException';

export default class extends HttpException {
  constructor() {
    super(400, 'This password reset has been used, please request another one.');
  }
}
