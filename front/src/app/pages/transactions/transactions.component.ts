import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { ServerServiceService } from '../../server-service.service';
import { UserService } from '../../services/user.service';

interface Transaction {
  id: number;
  idUserExp: number;
  idUserDest: number;
  destName : string; 
  destSurname : string; 
  destNumber : number;
  amount: number;
  created_at: Date;
  type: string;
  reversed: boolean;
  clicked?: boolean;
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
  transactionsActives: Transaction[] = [];
  id: number | null;
  name: string | null = localStorage.getItem('name');
  surname: string | null = localStorage.getItem('surname');
  isLoaded: boolean = true;
  AtransactionClicked: boolean = false;
  selectedTransaction: Transaction | null = null;

  constructor(private transactionService: TransactionService, private userService: UserService, private serverService: ServerServiceService, private router: Router, private _http: HttpClient) {
    const storedId = localStorage.getItem('id');
    this.id = storedId ? parseInt(storedId, 10) : null;
  }

  ngOnInit(): void {
    this.showHistory();
    this.LoadTransactionsActives();
  }

  LoadTransactionsActives() {
    //console.log(this.transactionsActives);
  }

  showHistory(): void {
    this.isLoaded = false;
    if (this.id) {
      this.transactionService.getTransactionHistory(this.id)
        .subscribe({
          next: (res) => {
            this.transactions = res.data.map((transaction: any) => ({ ...transaction, clicked: false }));
            this.transactionsActives = this.transactions.filter(transaction => !transaction.reversed);
            this.transactions.sort((a, b) => (a.id > b.id ? -1 : 1));
          },
          error: (error) => {
            this.isLoaded = true;
            console.error("Erreur lors du chargement de l'historique", error);
          },
          complete: () => {
            this.isLoaded = true;
            this.loadDest(this.transactions); 
          }
        });
    } else {
      console.error("Pas d'id utilisateur trouvé");
    }
  }
  loadDest(transaction : Transaction[]){
    console.log('enclenché');
    if(transaction){
      this.transactions.forEach(transaction => {
        this.userService.showUser(transaction.idUserDest).subscribe({
          next: (res: any) => {
            transaction.destName = res.data.name;
            transaction.destSurname = res.data.surname;
            transaction.destNumber = res.data.number;
          },
          error: (err) => {
            console.error('Error fetching user data:', err);
          }
        });        
      });
      
    }
  }

  demandeMdp(): Observable<boolean> {
    this.isLoaded = false;
    const password = prompt('Veuillez entrer votre mot de passe pour confirmer : ');
    if (!password) {
      return of(false);
    }
    const number = localStorage.getItem('number');
    const userData = { number, password };
    return this._http.post<any>(`http://127.0.0.1:8000/api/users/history/${this.id}/reverse`, userData).pipe(
      map((res) => {
        //console.log(res);
        localStorage.setItem('mdpReponse', res.status);
        return res.status;
      }),
      catchError((error) => {
        console.error('Erreur lors de la confirmation du mot de passe.', error);
        this.isLoaded = true;
        return of(false);
      })
    );
  }

  reverseOperation(idTransaction: number): void {
    const confirmation = confirm(`Vous allez demander le reverse de la transaction numéro : ${idTransaction}`);
    //console.log(localStorage.getItem('mdpReponse'));
    if (confirmation) {
      if (localStorage.getItem('mdpReponse') === 'true') {
        this._http.delete(`http://127.0.0.1:8000/api/transactions/${idTransaction}`)
          .subscribe({
            next: (res: any) => {
              alert(res.message);
              this.transactions = this.transactions.filter(transaction => transaction.id !== idTransaction);
              this.serverService.refreshBalance(res.data.amount, 'depot');
              //console.log(this.transactions);
            },
            error: (error) => {
              console.error("Erreur lors de l'opération", error);
            }
          });
      } else {
        //console.log('reverse échoué');
      }
    }
  }

  reverse(idTransaction: number): void {
    this.demandeMdp().subscribe((isPasswordConfirmed) => {
      //console.log(isPasswordConfirmed);
      if (isPasswordConfirmed) {
        this.reverseOperation(idTransaction);
      } else {
        alert("Mot de passe incorrect");
        //console.log('Mot de passe incorrect ou non confirmé.');
      }
      localStorage.removeItem('mdpReponse');
    });
    this.isLoaded = false;
  }

  transactionClickedFunc(transaction: Transaction): void {
    transaction.clicked = !transaction.clicked;
    this.AtransactionClicked = !this.AtransactionClicked;
    this.selectedTransaction = transaction;
  }

  closeOverlay(): void {
    this.selectedTransaction = null;
  }

  lookforDest(id: number): void {
    
  }
}
