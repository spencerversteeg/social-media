import HttpException from './HttpException';

export default class extends HttpException {
  constructor() {
    super(400, 'A token must be provided.');
  }
}
