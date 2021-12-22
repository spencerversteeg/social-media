import ParsedZodError from '../@types/ParsedZodError';
import HttpException from './HttpException';

export default class InvalidFieldsException extends HttpException {
  constructor(errors: ParsedZodError) {
    super(400, 'Invalid input', errors);
  }
}
