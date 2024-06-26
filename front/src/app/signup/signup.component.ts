import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { SignUp } from '../pages/sign-up';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  imagePath : string = "../images/logo.png" ;
  signUpObj : SignUp = new SignUp() ; 
  userForm: FormGroup; 
  isSubmitted : boolean = false ; 
  toastr = inject(ToastrService); 

  constructor(private router:Router, private authService:AuthService , private http: HttpClient){
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.pattern('^[A-Za-z- ]+$'),Validators.required]),
      surname: new FormControl('',[Validators.pattern('^[A-Za-z- ]+$'), Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(13), /* Validators.pattern('^\d') */]),
      password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15)/*,  Validators.pattern('/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/')*/] 
    ),
      typeDeCompte: new FormControl('', [Validators.required]),
      admin: new FormControl('no') 
    });}

  signIn(){
    this.router.navigate(['login']);
  }
  onSubmit(){

    this.isSubmitted=true; 
    this.userForm.markAllAsTouched();
    this.userForm.valid;
    //console.log(this.userForm);

    this.authService.register(this.userForm.value).subscribe({
      next : (res)=>{
        this.toastr.success("Inscription réussie");
      },
      error : (error : any) => {
        this.toastr.error("Vérifiez vos données","Inscription non valide");
      },
      complete:()=>{
        this.toastr.success("Inscription réussie");
      }
    });
    //this.router.navigate(['login']);
  }
}
