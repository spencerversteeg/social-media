import HttpException from './HttpException';

export default class extends HttpException {
  constructor() {
    super(401, 'Your passwords do not match');
  }
}
