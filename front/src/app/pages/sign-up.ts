// signup.model.ts
export class SignUp {
    number: number;
    password: string;
    name: string;
    surname: string;
    accountType: boolean;
    bornOn: Date;
  
    constructor() {
      this.number = 0;
      this.password = '';
      this.name = '';
      this.surname = '';
      this.accountType = false;
      this.bornOn = new Date();
    }
  }
  