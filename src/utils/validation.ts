export const name = {
  required_error: 'Name is required.',
  invalid_type_error: 'Name is invalid.',
  minLength: 'Name must be at least 3 characters long.',
  maxLength: 'Name must be at most 32 characters long.'
};

export const email = {
  required_error: 'Email is required.',
  invalid_type_error: 'Email is invalid.'
};

export const password = {
  required_error: 'Password is required.',
  invalid_type_error: 'Password is invalid',
  pattern:
    'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number and one special character.',
  nonMatch: 'Passwords do not match.'
};

export const confirmPassword = {
  required_error: 'Please confirm your password.',
  invalid_type_error: 'Password is invalid.',
  pattern:
    'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number and one special character.'
};
