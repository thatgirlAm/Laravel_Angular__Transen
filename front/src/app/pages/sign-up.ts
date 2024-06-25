// signup.model.ts
export class SignUp {
    number: number;
    password: string;
    name: string;
    surname: string;
    typeDeCompte: boolean;
    dateOfBirth: Date;
    balance: number;
  
    constructor() {
      this.number = 0;
      this.password = '';
      this.name = '';
      this.surname = '';
      this.typeDeCompte = false;
      this.dateOfBirth = new Date();
      this.balance = 0;
    }
  }
  