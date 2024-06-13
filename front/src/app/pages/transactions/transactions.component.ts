// history.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction.service';

interface Transaction {
  id: number;
  idUserExp: number;
  idUserDest: number;
  amount: number;
  created_at: Date;
  type: string;
  reversed: boolean;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, DatePipe],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  
  transactions: Transaction[] = [];
  id: number | null;
  name: string | null = localStorage.getItem('name');
  surname: string | null = localStorage.getItem('surname');

  constructor(private transactionService: TransactionService, private router: Router) {
    const storedId = localStorage.getItem('id');
    this.id = storedId ? parseInt(storedId, 10) : null;
  }

  ngOnInit(): void {
    if (this.id) {
      this.showHistory();
    } else {
      this.router.navigate(['login']);
    }
  }

  showHistory(): void {
    if (this.id) {
      this.transactionService.getTransactionHistory(this.id)
        .subscribe({
          next: (res) => {
            this.transactions = res.data;
          },
          error: (error) => {
            console.error('Error fetching transaction history:', error);
          }
        });
    } else {
      console.error('No user id found.');
    }
  }

  reverse(idTransaction: number): void {
    this.demandeMdp().pipe(
      tap((res: any) => localStorage.setItem('mdpReponse', res.status)),
      switchMap(() => this.reverseOperation(idTransaction)),
      catchError((error) => {
        console.error('Error during reverse operation:', error);
        return [];
      })
    ).subscribe();
  }

  demandeMdp(): Observable<any> {
    const password = prompt('Veuillez entrer votre mot de passe pour confirmer : ');
    const number = localStorage.getItem('number');
    if (this.id && password && number) {
      return this.transactionService.requestPasswordConfirmation(this.id, number, password);
    } else {
      console.error('Password or number not provided.');
      return new Observable();
    }
  }

  reverseOperation(idTransaction: number): Observable<any> {
    const mdpReponse = localStorage.getItem('mdpReponse');
    if (mdpReponse === 'true') {
      return this.transactionService.reverseTransaction(idTransaction).pipe(
        tap((res: any) => {
          alert(res.message);
          this.transactions = this.transactions.filter(transaction => transaction.id !== res.data.id);
          localStorage.removeItem('mdpReponse');
        }),
        catchError((error) => {
          console.error('Error during delete operation:', error);
          return [];
        })
      );
    } else {
      console.error('Password confirmation failed or missing.');
      return new Observable();
    }
  }

  lookforDest($id: number): void {
  }
}
