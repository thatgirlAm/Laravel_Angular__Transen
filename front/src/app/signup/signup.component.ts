import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { SignUp } from '../pages/sign-up';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signUpObj : SignUp = new SignUp() ; 
  userForm: FormGroup; 
  isSubmitted : boolean = false ; 

  constructor(private router:Router, private authService:AuthService , private http: HttpClient){
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.pattern('^[A-Za-z- ]+$'),Validators.required]),
      surname: new FormControl('',[Validators.pattern('^[A-Za-z- ]+$'), Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(13), /* Validators.pattern('^\d') */]),
      password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern('[a-zA-Z ]*$')]),
      typeDeCompte: new FormControl('', [Validators.required]),
      admin: new FormControl('no') 
    });}

  onSubmit(){

    this.isSubmitted=true; 
    this.userForm.markAllAsTouched();
    this.userForm.valid;
    console.log(this.userForm);

    this.authService.register(this.userForm.value).subscribe({
      next : (res:any)=>{
        console.log(res.status);
      }
    });
    //this.router.navigate(['login']);
  }
}
