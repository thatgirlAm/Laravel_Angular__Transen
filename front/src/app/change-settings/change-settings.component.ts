import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-settings',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './change-settings.component.html',
  styleUrl: './change-settings.component.css'
})
export class ChangeSettingsComponent {

  userForm : FormGroup;
  isFormSubmetted : boolean = false; 

  constructor(){
    this.userForm = new FormGroup({
      name: new FormControl(''),
      surname: new FormControl(''),
      dateOfBirth: new FormControl(''),
      number: new FormControl(),
      password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern('[a-zA-Z ]*$')])
    });
  }

  onsubmit(){
    this.isFormSubmetted = true;
    this.userForm.markAsTouched(); 
  }
}
