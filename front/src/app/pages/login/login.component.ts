import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Login } from '../log-in';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 
import { Toast, ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports:[FormsModule, NgIf]
})
export class LoginComponent implements OnInit {
  loginObj: Login = new Login();
  isloaded : boolean = true ; 

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    localStorage.clear();
  }

  RedirectSignup(){
    this.router.navigate(['signup']);
  }
  onLogin() {
    //console.log(this.loginObj);
    this.isloaded = false;
    this.authService.login(this.loginObj).subscribe({
      next: (res: any) => {
        if (res.status) {
          // Process the response here
/*           this.toastr.success('Authentification réussie');
 */          
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('balance', res.data.balance);
          localStorage.setItem('number', res.data.number);
          localStorage.setItem('id', res.data.id);
          localStorage.setItem('name', res.data.name);
          localStorage.setItem('surname', res.data.surname);
          localStorage.setItem('typeDeCompte', res.data.typeDeCompte);
          this.router.navigate(['/history']);
        } else {
          this.toastr.error(res.message);
        }
        this.isloaded = true;
      },
      error: (error: any) => {
        console.error('Erreur lors de la connexion:', error);
        this.toastr.error('Veuillez vérifier vos identifiants.','Une erreur est survenue lors de la connexion.' );
        this.isloaded = true;
      },
      complete: () => {
        this.isloaded = true;
      }
    });
  }
  
}
