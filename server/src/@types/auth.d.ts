export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerificationParameters {
  token: string;
}
