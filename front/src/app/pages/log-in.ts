// login.model.ts
export class Login {
    number?: number | undefined;
    password?: string | undefined;
  
    constructor(number?: number, password?: string) {
      this.number = number;
      this.password = password;
    }
  }
  