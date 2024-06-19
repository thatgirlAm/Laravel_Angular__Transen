import { Component, EventEmitter, OnInit, Output, input } from '@angular/core';
import { ServerServiceService } from '../../server-service.service';
import { Input } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-transaction-sucess',
  templateUrl: './transaction-sucess.component.html',
  styleUrls: ['./transaction-sucess.component.css'],
  standalone:true
})
export class TransactionSucessComponent implements OnInit {
  storedBalance = localStorage.getItem('balance');

  amountString: string | null = localStorage.getItem('amount');
  amount: number | null = this.amountString ? parseInt(this.amountString, 10) : null;
  type = localStorage.getItem('type'); 

  constructor(private serverService: ServerServiceService) {}

  ngOnInit(): void {
    const amount = localStorage.getItem('amount');
    const parsedAmount = amount ? parseInt(amount) : null;
    const type = localStorage.getItem('type');
    if (parsedAmount && type) {
       // this.balance.update(this.balance+parsedAmount)
        this.serverService.refreshBalance(parsedAmount, type);
        this.serverService.loadBalance();
        localStorage.removeItem('idUserDest');
        localStorage.removeItem('destChecked');
        localStorage.removeItem('type');
        localStorage.removeItem('amount'); 
        localStorage.removeItem('typeDecompteDestTemp');
        localStorage.removeItem('destNumber');
    }
      }
}
