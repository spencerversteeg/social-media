import HttpException from './HttpException';

export default class extends HttpException {
  constructor() {
    super(404, 'Not found');
  }
}
