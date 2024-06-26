// Register.component.ts
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SignUp } from '../sign-up';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-Register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  toastr = inject(ToastrService);
  RegisterObj: SignUp = new SignUp();

  constructor(private userService: UserService) {}

  onRegister() {
    this.userService.signup(this.RegisterObj).subscribe(
      (res: any) => {
        if (res.result) {
          this.toastr.success("Inscription réussie !");
        } else {
          this.toastr.error("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
        }
      },
      (error) => {
        console.error("Erreur lors de l'inscription:", error);
        this.toastr.error("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
      }
    );
  }
}
