export class User {
  public name: string;
  public email: string;
  public password: string;
  public confirmPassword: string;
  public verificationCode: string;
  
  constructor(name: string = '',
    email: string = '',
    password: string = '',
    confirmPassword: string = '',
    verificationCode: string = ''
  ) {
  }

}
