import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Login } from '../log-in';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports:[FormsModule]
})
export class LoginComponent implements OnInit {
  loginObj: Login = new Login();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    localStorage.clear();
  }

  onLogin() {
    console.log(this.loginObj);
    
    this.authService.login(this.loginObj).subscribe({
      next: (res: any) => {
        if (res.status) {
          console.log(res);
          
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('number', res.data.number);
          localStorage.setItem('id', res.data.id);
          localStorage.setItem('name', res.data.name);
          localStorage.setItem('surname', res.data.surname);
          localStorage.setItem('typeDeCompte', res.data.typeDeCompte);
          this.router.navigate(['/dashboard']);
        } else {
          alert(res.message);
        } 
      },
      error: (error) => {
        console.error('Erreur lors de la connexion:', error);
        alert("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
      }
    });
  }
}
