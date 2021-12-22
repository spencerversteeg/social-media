import ParsedZodError from '../@types/ParsedZodError';

export default class extends Error {
  public status: number;
  public message: string;
  public errors?: ParsedZodError;

  constructor(status: number, message: string, errors?: ParsedZodError) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}
