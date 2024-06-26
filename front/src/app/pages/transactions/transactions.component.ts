import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, finalize } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { ServerServiceService } from '../../server-service.service';
import { UserService } from '../../services/user.service';
import { PdfManagerService } from '../../pdf-manager.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

interface Transaction {
  id: number;
  idUserExp: number;
  idUserDest: number;
  destName?: string; 
  destSurname?: string; 
  expName?: string; 
  expSurname?: string; 
  destNumber?: number;
  expNumber?: number; 
  amount: number;
  created_at: Date;
  type: string;
  reversed: boolean;
  clicked?: boolean;
  isDestinaire?: boolean;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
}



@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, DatePipe],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  toastr = inject(ToastrService);
  transactions: Transaction[] = [];
  transactionsActives: Transaction[] = [];
  id: number | null;
  name: string | null = localStorage.getItem('name');
  surname: string | null = localStorage.getItem('surname');
  isLoaded: boolean = true;
  AtransactionClicked: boolean = false;
  selectedTransaction: Transaction | null = null;

  constructor(
    private transactionService: TransactionService, 
    private userService: UserService, 
    private serverService: ServerServiceService, 
    private router: Router, 
    private _http: HttpClient,
    private pdfManager : PdfManagerService 
  ) {
    const storedId = localStorage.getItem('id');
    this.id = storedId ? parseInt(storedId, 10) : null;
  }

  ngOnInit(): void {
    this.showHistory();
  }

  showHistory(): void {
    this.isLoaded = false;
    if (this.id) {
      this.transactionService.getTransactionHistory(this.id).subscribe({
        next: (res: ApiResponse<Transaction[]>) => {
          this.transactions = res.data.map(transaction => ({
            ...transaction,
            clicked: false,
            isDestinaire: localStorage.getItem('id') === String(transaction.idUserDest)
          }));
          this.transactionsActives = this.transactions.filter(transaction => !transaction.reversed);
          this.transactions.sort((a, b) => b.id - a.id);
        },
        error: (error) => {
          this.isLoaded = true;
          console.error("Erreur lors du chargement de l'historique", error);
          this.toastr.error("Erreur lors du chargement de l'historique");
        },
        complete: () => {
          this.isLoaded = true;
          this.loadDestUsers(this.transactions);
          this.loadExpUsers(this.transactions);
        }
      });
    } else {
      console.error("Pas d'id utilisateur trouvé");
      this.toastr.error("Pas d'id utilisateur trouvé");
    }
  }

  loadDestUsers(transactions: Transaction[]): void {
    this.isLoaded = false;

    const destRequests = transactions.map(transaction =>
      this.userService.showUser_(transaction.idUserDest).pipe(
        map((res: any) => ({ id: transaction.id, dest: res.data })),
        catchError(error => {
          console.error('Erreur lors du chargement du destinataire', error);
          return of(null);
        })
      )
    );

    forkJoin(destRequests).subscribe({
      next: (results) => {
        results.forEach(result => {
          if (result) {
            const transaction = this.transactions.find(t => t.id === result.id);
            if (transaction && transaction.type =="transfert") {
              transaction.destName = result.dest.name;
              transaction.destSurname = result.dest.surname;
              transaction.destNumber = result.dest.number;
            }
          }
        });
      },
      error: (error) => {
        console.error("Erreur lors du chargement des destinataires", error);
        this.toastr.error("Erreur lors du chargement des destinataires");
      },
      complete: () => {
        this.isLoaded = true;
      }
    });
  }

  loadExpUsers(transactions: Transaction[]): void {
    this.isLoaded = false;

    const expRequests = transactions.map(transaction =>
      this.userService.showUser_(transaction.idUserExp).pipe(
        map((res: any) => ({ id: transaction.id, exp: res.data })),
        catchError(error => {
          console.error("Erreur lors du chargement de l'expéditeur", error);
          return of(null);
        })
      )
    );

    forkJoin(expRequests).subscribe({
      next: (results) => {
        results.forEach(result => {
          if (result) {
            const transaction = this.transactions.find(t => t.id === result.id);
            if (transaction) {
              transaction.expName = result.exp.name;
              transaction.expSurname = result.exp.surname;
              transaction.expNumber = result.exp.number;
            }
          }
        });
      },
      error: (error) => {
        console.error("Erreur lors du chargement des expéditeurs", error);
        this.toastr.error("Erreur lors du chargement des expéditeurs");
      },
      complete: () => {
        this.isLoaded = true;
      }
    });
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
    if (confirmation) {
      if (localStorage.getItem('mdpReponse') === 'true') {
        this._http.delete(`http://127.0.0.1:8000/api/transactions/${idTransaction}`)
          .subscribe({
            next: (res: any) => {
              this.toastr.success(res.message);
              this.transactions = this.transactions.filter(transaction => transaction.id !== idTransaction);
              this.serverService.refreshBalance(res.data.amount, 'depot');
            },
            error: (error) => {
              console.error("Erreur lors de l'opération", error);
            }
          });
      }
    }
  }

  reverse(idTransaction: number): void {
    this.demandeMdp().subscribe((isPasswordConfirmed) => {
      if (isPasswordConfirmed) {
        this.reverseOperation(idTransaction);
      } else {
        this.toastr.error("Mot de passe incorrect");
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

  lookforDest(id: number): void {}

  ReceiptDownload(transaction:Transaction){
    this.pdfManager.generateReceipt(transaction);
  }
}
