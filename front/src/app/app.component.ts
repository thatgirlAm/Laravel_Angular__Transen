import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './pages/header/header.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { RegisterComponent } from './pages/register/register.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionSucessComponent } from './pages/transaction-sucess/transaction-sucess.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule,DashboardComponent, HeaderComponent, CommonModule, RegisterComponent, TransactionsComponent, TransactionSucessComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] ,
  host: { 'ngSkipHydration': '' } //--Résolution de problème en skippant ce phénomène--//
})
export class AppComponent  {
  title = 'app';
  constructor(private router: Router) {}
 
  
  //--Méthode pour savoir quand faire apparaître le menu--//
  isLoginPage(): boolean {
    return this.router.url === '/login'; 
  }
  isSignupPage(): boolean {
    return this.router.url === '/signup'; 
  }
}

