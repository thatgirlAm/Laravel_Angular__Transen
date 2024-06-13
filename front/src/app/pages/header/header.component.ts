import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  transactions: any;
  number!: number;
  name: string | null = null;
  surname: string | null = null;
  storedId: string | null = null;
  id: number | null = null;
  balance: number | null = null;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name');
    this.surname = localStorage.getItem('surname');
    this.storedId = localStorage.getItem('id');
    this.id = this.storedId ? parseInt(this.storedId, 10) : null;
    this.loadBalance();
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
        (error) => {
          console.error('Erreur lors de la récupération du solde:', error);
        }
      );
    } else {
      console.error('Aucun identifiant utilisateur trouvé.');
    }
  }

  showParameters() {
    // Implémentation nécessaire pour afficher les paramètres
  }

  putNewTransaction() {
    this.router.navigate(['newtransaction']);
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
