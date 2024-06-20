import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../../services/user.service';
import { ServerServiceService } from '../../server-service.service';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css'],
  standalone: true,
  imports: [ NgIf, ReactiveFormsModule, CommonModule, HeaderComponent]
})
export class NewtransactionComponent implements OnInit {
  storedBalance = localStorage.getItem('balance');
  @Input() balance: number = this.storedBalance ? parseInt(this.storedBalance, 10) : 0;
  @Output() nchange : EventEmitter<number> = new EventEmitter(); 
  transaction = new Transaction();
  transactionForm!: FormGroup;
  isTransfert: boolean = false;
  name: string | null = localStorage.getItem('name');
  surname: string | null = localStorage.getItem('surname');

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router, 
    private serverService: ServerServiceService
  ) {}

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      amount: [0],
      type: [null],
      recipient: [0],
      idUserExp: [localStorage.getItem('id')],
      idUserDest: [0],
      date: [new Date()]
    });
  }

 
  selectIsTransfert(): void {
    const selected = this.transactionForm.get('type')?.value;
    this.isTransfert = selected === 'transfert';
  }

  destCheck(): void {
    const number = this.transactionForm.get('recipient')?.value;
    const type = this.transactionForm.get('type')?.value;
    const amount = this.transactionForm.get('amount')?.value;
    if(this.transactionForm.get('type')?.value && this.transactionForm.get('amount')?.value){
    if(type=="transfert"){
    this.transactionService.findUserByNumber(number).subscribe({
      next: (res) => {
        try {
          console.log(res);
          localStorage.setItem('idUserDest', res.data.id);
          localStorage.setItem('amount', amount);
          localStorage.setItem('type', type);
          localStorage.setItem('destChecked', res.status);
          localStorage.setItem('typeDecompteDestTemp', res.data.typeDeCompte);
          localStorage.setItem('destNumber', res.data.number);
          //console.log(localStorage.getItem('idUserDest'))
          if (localStorage.getItem('destChecked') && localStorage.getItem('typeDecompteDestTemp') === localStorage.getItem('typeDeCompte')) {
            this.validateTransaction();
          } else {
            throw new Error('Les types de comptes ne correspondent pas.');
          }
        } catch (error: any) {
          alert(error.message);
        }
      },
      error: (error) => {
        alert("Le destinataire n'existe pas.");
      }
    });}

    else{
      this.validateTransaction();
    }}
    else{
      alert("Veuillez remplir tous les champs.");
    }
  }

  validateTransaction(): void {
    this.transaction = this.transactionForm.value;
    const storedIdUserDest = localStorage.getItem('idUserDest');
    if (storedIdUserDest ) {
      this.transaction.idUserDest = localStorage.getItem('idUserDest') ? parseInt(storedIdUserDest, 10) : 0;
    }
    this.transactionService.validateTransaction(this.transaction).subscribe((res: any) => {
      if(res.status){
        if(this.transaction.type){
          this.serverService.refreshBalance(this.transaction.amount, this.transaction.type); 
          this.router.navigate(['transaction-success']);}
        }
      else{
        alert(res.message);
        this.ngOnInit();
      }
    });
  }
}

export class Transaction {
  amount: number = 0;
  type: string | null = "";
  nbDest: number = 0;
  idUserExp = localStorage.getItem('id');
  idUserDest: number | null = 0;
  date = new Date();
}
