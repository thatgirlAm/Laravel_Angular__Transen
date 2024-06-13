import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './pages/header/header.component';
import { RegisterComponent } from './pages/register/register.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { NewtransactionComponent } from './pages/new-transaction/new-transaction.component';
import { TransactionSucessComponent } from './pages/transaction-sucess/transaction-sucess.component';
import { AuthGuardGuard } from './auth-guard.guard';
import { AntiAuthGuard} from './anti-auth.guard';

export const routes: Routes = [
    { 
        path: '', redirectTo: 'login', pathMatch: 'full' 
    },
    { 
        path: 'login', component: LoginComponent, canActivate:[AntiAuthGuard]
    },
    { 
        path: 'signup', component: RegisterComponent , //canActivate:[AuthGuard]
    },
    { 
        path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuardGuard]
    },
    {
        path: 'header', component: HeaderComponent, canActivate:[AuthGuardGuard]
    },
    { 
        path: 'history', component: TransactionsComponent , canActivate:[AuthGuardGuard]
    },
    { 
        path: 'newtransaction', component: NewtransactionComponent, canActivate:[AuthGuardGuard]
    },
    { 
        path: 'transactionSucess', component: TransactionSucessComponent, canActivate:[AuthGuardGuard]
    }

];
