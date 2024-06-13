import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-new-transaction',
  templateUrl: './new-transaction.component.html',
  styleUrls: ['./new-transaction.component.css'],
  standalone: true,
  imports: [ NgIf, ReactiveFormsModule, CommonModule]
})
export class NewtransactionComponent implements OnInit {
  transaction = new Transaction();
  transactionForm!: FormGroup;
  isTransfert: boolean = false;
  name: string | null = localStorage.getItem('name');
  surname: string | null = localStorage.getItem('surname');

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router
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
    if(type=="transfert"){
    this.transactionService.findUserByNumber(number).subscribe({
      next: (res) => {
        try {
          console.log(res);
          localStorage.setItem('idUserDest', res.data.id);
          localStorage.setItem('destChecked', res.status);
          localStorage.setItem('typeDecompteDestTemp', res.data.typeDeCompte);
          localStorage.setItem('destNumber', res.data.number);
          console.log(localStorage.getItem('idUserDest'))
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
    }
  }

  validateTransaction(): void {
    this.transaction = this.transactionForm.value;
    const storedIdUserDest = localStorage.getItem('idUserDest');
    if (storedIdUserDest) {
      this.transaction.idUserDest = localStorage.getItem('idUserDest') ? parseInt(storedIdUserDest, 10) : 0;
    }
    this.transactionService.validateTransaction(this.transaction).subscribe((res: any) => {
      if(res.status){
        console.log(this.transaction);
        localStorage.removeItem('idUserDest');
        localStorage.removeItem('destChecked');
        localStorage.removeItem('typeDecompteDestTemp');
        localStorage.removeItem('destNumber');
        this.router.navigate(['transaction-success']);
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
