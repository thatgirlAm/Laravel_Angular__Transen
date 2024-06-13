import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction.service';
import { HttpClient } from '@angular/common/http';

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

  constructor(private transactionService: TransactionService, private router: Router, private _http: HttpClient) {
    const storedId = localStorage.getItem('id');
    this.id = storedId ? parseInt(storedId, 10) : null;
  }

  ngOnInit(): void {
    this.showHistory();
  }

  showHistory(): void {
    if (this.id) {
      this.transactionService.getTransactionHistory(this.id)
        .subscribe({
          next: (res) => {
            this.transactions = res.data;
            this.transactions.sort((a, b) => (a.id > b.id ? -1 : 1));
          },
          error: (error) => {
            console.error('Error fetching transaction history:', error);
          }
        });
    } else {
      console.error('No user id found.');
    }
  }

  demandeMdp(): Observable<boolean> {
    const password = prompt('Veuillez entrer votre mot de passe pour confirmer : ');
    const number = localStorage.getItem('number');
    const userData = { number, password };
    console.log(userData);
    return this._http.post<any>(`http://127.0.0.1:8000/api/users/history/${this.id}/reverse`, userData).pipe(
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
  

  reverseOperation(idTransaction: number): void {
    const confirmation = confirm(`Vous allez demander le reverse de la transaction numéro : ${idTransaction}`);
    console.log(localStorage.getItem('mdpReponse'));
    if (confirmation) {
      if (localStorage.getItem('mdpReponse') === 'true') {
        this._http.delete(`http://127.0.0.1:8000/api/transactions/${idTransaction}`)
          .subscribe({
            next: (res: any) => {
              alert(res.message);
            },
            error: (error) => {
              console.error('Error during transaction reversal:', error);
            }
          });
      } else {
        console.log('reverse échoué');
      }
    }
  }

  reverse(idTransaction: number): void {
    this.demandeMdp().subscribe((isPasswordConfirmed) => {
      if (isPasswordConfirmed) {
        this.reverseOperation(idTransaction);
      } else {
        console.log('Mot de passe incorrect ou non confirmé.');
      }
      localStorage.removeItem('mdpReponse');
    });
  }
  

  lookforDest(id: number): void {
    // TODO: Implement this method if needed
  }
}
