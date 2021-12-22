import HttpException from './HttpException';

export default class extends HttpException {
  constructor() {
    super(401, 'Invalid username or password.');
  }
}
