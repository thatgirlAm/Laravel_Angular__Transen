import { NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-email-test',
  standalone: true,
  imports: [NgIf],
  templateUrl: './email-test.component.html',
  styleUrl: './email-test.component.css'
})
export class EmailTestComponent {
 @ViewChild('formRef') formRef!: NgForm;
email:string = '';
onSubmit() {
    if (this.formRef.invalid) {

    } else {
    }
  }}