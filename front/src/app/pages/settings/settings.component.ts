import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent //implements OnInit 
{
  settingsForm: FormGroup;
  settings: Settings | null = null;
  idToString:string| null = localStorage.getItem('id');
  id: number = this.idToString? parseInt(this.idToString) : 0 ; 
  name:string |null = localStorage.getItem('name') ? localStorage.getItem('name') : null;
  surname:string |null = localStorage.getItem('surname') ? localStorage.getItem('surname') : null;
  number:string |null = localStorage.getItem('number') ? localStorage.getItem('number') : null;
  typeDeCompte:string |null = localStorage.getItem('typeDeCompte') ? localStorage.getItem('typeDeCompte') : null;


  constructor(private fb: FormBuilder, private router: Router, private http:HttpClient) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSettings();
  }

  initForm(): void {
    this.settingsForm = this.fb.group({
      name: [''],
      surname: [''],
      number: [''],
      typeDeCompte: ['']
    });
  }

  loadSettings(): void {
    this.settings = {
      name: localStorage.getItem('name') || '',
      surname: localStorage.getItem('surname') || '',
      number: localStorage.getItem('number') || '',
      createdAt: new Date(),
      typeDeCompte: localStorage.getItem('typeDeCompte')||'' 
    };
  }

  updateSettings(): void {
    if (this.settingsForm.valid) {
      const updatedSettings = this.settingsForm.value;
      this.http.put(`http://127.0.0.1:8000/api/users`, updatedSettings).subscribe({ next: (res:any) => {
        localStorage.setItem('name', res.data.name);
        localStorage.setItem('surname', res.data.surname);
        alert('Données mises à jour');
        this.router.navigate(['settings']);}});
    }
  }

  passwordChange(){
    if(this.demandeMdp()){
      this.showPassWordChange();
    };
 
  }

  showPassWordChange(){
  }

  demandeMdp(): Observable<boolean> {
    const password = prompt('Veuillez entrer votre mot de passe pour confirmer : ');
    const number = localStorage.getItem('number');
    const userData = { number, password };
    console.log(userData);
    return this.http.post<any>(`http://127.0.0.1:8000/api/users/history/${this.id}/reverse`, userData).pipe(
      map((res) => {
        console.log(res);
        
        localStorage.setItem('mdpReponse', res.status);
        console.log(`http://127.0.0.1:8000/api/users/history/${this.id}/reverse`);
;        return res.status;
      }),
      catchError((error) => {
        console.error('Error during password confirmation:', error);
        return of(false);
      })
    );
  }
  numberChange(): void {
    alert("Veuillez vous rapprocher d'une boutique Transen pour changer de numéro.");
    this.router.navigate(['settings']);
  }
}

interface Settings {
  name: string;
  surname: string;
  number: string;
  createdAt: Date;
  typeDeCompte:string; 
}
