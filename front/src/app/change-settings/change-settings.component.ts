import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

@Component({
  selector: 'app-change-settings',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, MatDialogModule, MatButtonModule],
  templateUrl: './change-settings.component.html',
  styleUrl: './change-settings.component.css'
})
export class ChangeSettingsComponent {
  toastr = inject(ToastrService);
  userForm : FormGroup;
  isFormSubmetted : boolean = false; 

  constructor(public dialogRef: MatDialogRef<ChangeSettingsComponent>, private authService : AuthService, private router : Router){
    this.userForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern('/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/')]),
      passwordConfirmed: new FormControl('', [Validators.required]),
      oldPassword: new FormControl('', [Validators.required])
    });
  }

  hiddePasswordSettings(){
    this.dialogRef.close();
  }



  onsubmit(){
    this.isFormSubmetted = true;
    this.userForm.markAsTouched(); 
    const numberToString = localStorage.getItem('number');
    const number = numberToString ? parseInt(numberToString) : null ; 
    if(number){
      if(this.userForm.get('newPassword')?.value === this.userForm.get('passwordConfirmed')?.value){
        if(this.authService.checkmdp(number, this.userForm.get('newPassword')?.value)){
          this.authService.changePassword(this.userForm.get('newPassword')?.value);
        }
      }
      else{
        this.toastr.warning('Les mots de passe de correspondent pas.');
        this.router.navigate(['settings']); 
      }
      
    }
  }
}
