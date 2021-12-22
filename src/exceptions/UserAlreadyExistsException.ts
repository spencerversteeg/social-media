import HttpException from './HttpException';

export default class extends HttpException {
  constructor() {
    super(409, 'A user with that email already exists');
  }
}
