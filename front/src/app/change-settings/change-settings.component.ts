import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-change-settings',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, MatDialogModule, MatButtonModule],
  templateUrl: './change-settings.component.html',
  styleUrl: './change-settings.component.css'
})
export class ChangeSettingsComponent {

  userForm : FormGroup;
  isFormSubmetted : boolean = false; 

  constructor(public dialogRef: MatDialogRef<ChangeSettingsComponent>){
    this.userForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern('/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/')]),
      passworConfirmed: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  hiddePasswordSettings(){
    this.dialogRef.close();
  }

  onsubmit(){
    this.isFormSubmetted = true;
    this.userForm.markAsTouched(); 
  
  }
}
