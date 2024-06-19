import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ServerServiceService } from '../../server-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  number!: number;
  name: string | null = null;
  surname: string | null = null;
  storedId: string | null = null;
  id: number | null = null;
  
  storedBalance = localStorage.getItem('balance');
  @Input() balance: number = this.storedBalance ? parseInt(this.storedBalance, 10) : 0;
  @Output() nchange : EventEmitter<number> = new EventEmitter(); 

  private _transactions: any;
  public get transactions(): any {
    return this._transactions;
  }
  public set transactions(value: any) {
    this._transactions = value;
  }


  constructor(private userService: UserService, private serverService: ServerServiceService, private router: Router) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name');
    this.surname = localStorage.getItem('surname');
    this.storedId = localStorage.getItem('id');
    this.id = this.storedId ? parseInt(this.storedId, 10) : null;
     //this.loadBalance();
    this.serverService.balance$.subscribe({
      next: (res) => {
        this.balance = res;
        console.log(this.balance);
        
      }
    }); 
  }

  redirectHistory() {
    this.router.navigate(['history']);
  }


   loadBalance(): void {
    if (this.id) {
      this.userService.getBalance(this.id).subscribe(
        (res: any) => {
          this.balance = res.data;
        },
      );
    } else {
      console.error('Aucun identifiant utilisateur trouvé.');
    }
  } 

  showParameters() {
    this.router.navigate(['settings']);
  }

  putNewTransaction() {
    this.router.navigate(['newtransaction']);
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
