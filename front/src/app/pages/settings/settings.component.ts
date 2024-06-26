import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, model } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { ChangeSettingsComponent } from '../../change-settings/change-settings.component';
import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit 
{
  isloaded : boolean = false ; 
  toastr = inject(ToastrService);
  settingsForm!: FormGroup;
  settings: Settings | null = null;
  idToString:string| null = localStorage.getItem('id');
  id: number = this.idToString? parseInt(this.idToString) : 0 ; 
  name:string |null = localStorage.getItem('name') ? localStorage.getItem('name') : null;
  surname:string |null = localStorage.getItem('surname') ? localStorage.getItem('surname') : null;
  number:string |null = localStorage.getItem('number') ? localStorage.getItem('number') : null;
  typeDeCompte:string |null = localStorage.getItem('typeDeCompte') ? localStorage.getItem('typeDeCompte') : null;
  modalIsOpened : boolean = false;


  constructor(private fb: FormBuilder, public dialog: MatDialog,private router: Router, private http:HttpClient) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSettings();
  }

  openModal(){
    this.modalIsOpened = !this.modalIsOpened;
  }
  


  initForm(): void {
    if(!this.modalIsOpened){
    this.settingsForm = this.fb.group({
      NewName: [this.name],
      NewSurname: [this.surname],
      number: [this.number],
      typeDeCompte: [this.typeDeCompte]
    });}
  }

  loadSettings(): void {
    if(!this.modalIsOpened){
    this.settings = {
      NewName: localStorage.getItem('name') || '',
      NewSurname: localStorage.getItem('surname') || '',
      number: localStorage.getItem('number') || '',
      createdAt: new Date(),
      typeDeCompte: localStorage.getItem('typeDeCompte')||'' }
    };
  }

  updateSettings(): void {
    this.isloaded = false ;
    if (this.settingsForm.valid && this.modalIsOpened) {
      const updatedSettings = {
        'name' : this.settingsForm.get('NewName')?.value,
        'surname' : this.settingsForm.get('NewSurname')?.value,
        'typeDeCompte': this.settingsForm.get('typeDeCompte')?.value
      }

      console.log(updatedSettings);
      
      this.http.put(`http://127.0.0.1:8000/api/users/${this.id}`, updatedSettings).subscribe({ next: (res:any) => {
        localStorage.setItem('name', res.data.name);
        localStorage.setItem('surname', res.data.surname);
        this.router.navigate(['settings']);}});
        this.loadSettings();
        this.router.navigate([]);
        this.toastr.success('Données mises à jour');

    error: (error : any )=>{
      this.toastr.error('Erreur','Une erreur est survenue lors du changement.');
    }
    complete: ()=>
    {
      this.toastr.success('Données mises à jour');
    }
  }}

  passwordChange(){
      this.showPassWordChange();

  }

  showPassWordChange(){
    const dialogRef = this.dialog.open(ChangeSettingsComponent, {
      width: '380px'
    });
    dialogRef.afterClosed().subscribe((result) => {
    console.log('The dialog was closed');
  }); 
  } 

  demandeMdp(): Observable<boolean> {
    const password = prompt('Veuillez entrer votre mot de passe pour confirmer : ');
    const number = localStorage.getItem('number');
    const userData = { number, password };
    //console.log(userData);
    return this.http.post<any>(`http://127.0.0.1:8000/api/users/history/${this.id}/reverse`, userData).pipe(
      map((res) => {
        //console.log(res);
        
        localStorage.setItem('mdpReponse', res.status);
        //console.log(`http://127.0.0.1:8000/api/users/history/${this.id}/reverse`);
;        return res.status;
      }),
      catchError((error) => {
        console.error('Erreur durant la confirmation du mot de passe : ', error);
        return of(false);
      })
    );
  }
  numberChange(): void {
    this.toastr.warning("Veuillez vous rapprocher d'une boutique Transen pour changer de numéro.");
    this.router.navigate(['settings']);
  }

}

interface Settings {
  NewName: string;
  NewSurname: string;
  number: string;
  createdAt: Date;
  typeDeCompte:string; 
}
