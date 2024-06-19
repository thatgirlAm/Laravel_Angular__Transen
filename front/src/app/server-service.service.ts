import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ServerServiceService implements OnInit {
  private _balance: BehaviorSubject<number>;
  private id: number | null = null;

  constructor(private router: Router, private userService: UserService) {
    const balanceString = localStorage.getItem('balance');
    const balance = balanceString ? parseInt(balanceString, 10) : 0;
    this._balance = new BehaviorSubject<number>(balance);
  }

  ngOnInit(): void {
    this.loadStoredId();
    this.loadBalance();
  }

  get balance$() {
    return this._balance.asObservable();
  }

  private updateBalance(newBalance: number) {
    this._balance.next(newBalance);
    localStorage.setItem('balance', newBalance.toString());
  }

  private loadStoredId(): void {
    const storedId = localStorage.getItem('id');
    this.id = storedId ? parseInt(storedId, 10) : null;
  }

  loadBalance(): void {
this._balance.next(50);
    if (this.id !== null) {
      this.userService.getBalance(this.id).subscribe({
        next: (res: any) => {
          const newBalance = res.data;
          this.updateBalance(newBalance);
        },
        error: (error) => {
          console.error("Erreur lors du chargement du solde", error);
        }
      });
    } else {
      console.error("L'utilisteur n'a pas été retrouvé");
    }
  }

  refreshBalance(amount: number, type: string): void {
    const _id= localStorage.getItem('id');
    this.id = _id ? parseInt(_id) : 0; 
    if (this.id !== null) {
      let newBalance = this._balance.value;
      switch (type) {
        case 'retrait':
        case 'transfert':
          newBalance -= amount;
          break;
        case 'depot':
          newBalance += amount;
          break;
        default:
          console.error('Type de transaction incorrect');
          return;
      }
      this.updateBalance(newBalance);
    } else {
      console.error('Utilisateur non connecté ou solde non initialisé');
    }
  }





}
