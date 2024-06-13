// Register.component.ts
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SignUp } from '../sign-up';

@Component({
  selector: 'app-Register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  RegisterObj: SignUp = new SignUp();

  constructor(private userService: UserService) {}

  onRegister() {
    this.userService.signup(this.RegisterObj).subscribe(
      (res: any) => {
        if (res.result) {
          alert("Inscription réussie !");
        } else {
          alert("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
        }
      },
      (error) => {
        console.error('Erreur lors de l\'inscription:', error);
        alert("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
      }
    );
  }
}
