import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  toastr = inject(ToastrService);
  user: string[] = []; 
  transactions: any[] = [];
  transaction: Transaction = new Transaction(); 
  id!: number | null;
  name: string | null = localStorage.getItem('name');
  surname: string | null = localStorage.getItem('surname');

  constructor(private TransactionService: TransactionService) {}

  ngOnInit(): void {
    const storedName = localStorage.getItem('name');
    const storedSurname = localStorage.getItem('surname');

    if (storedName !== null && storedSurname !== null) {
      const StoredName = storedName.charAt(0).toUpperCase() + storedName.slice(1); 
      const StoredSurname = storedSurname.charAt(0).toUpperCase() + storedSurname.slice(1); 

      this.user.push(StoredName); 
      this.user.push(StoredSurname); 

      this.fetchTransactionsUser();
    }
  }

  fetchTransactionsUser(): void {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.TransactionService.getTransactionsByUser(parseInt(userId, 10)).subscribe(
        (res: any) => {
          this.transactions = res;
        },
        (error) => {
          console.error('Error fetching transactions:', error);
        }
      );
    }
  }
}

export class Transaction {
  id: number = 0;
  idUserExp: number = 0;
  idUserDest: number = 0;
  amount: number = 0;
  date: string = '';
  type: string = '';
}
