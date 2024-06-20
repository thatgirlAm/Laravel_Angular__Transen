import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Login } from '../pages/log-in';
import { SignUp } from '../pages/sign-up';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  
  constructor(private http: HttpClient, private router: Router) {}

  register(registerForm : SignUp){
    return this.http.post<any>(`${this.apiUrl}/register`, registerForm).pipe(
      tap(res => {
        console.log(res);
        if(res.status){
          alert('Compte créé ! Vous pouvez désormais vous connecter.')
          this.router.navigate(['login']);
        }
      })
    );
  }
  login(loginData: Login): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          
        }
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      })
    );
  }

  checkmdp(number : number, mdp:string )
  {
    return this.http.post<any>(`${this.apiUrl}/confirmPassword`, {number, mdp}) ; 
  }

  changePassword(newPassword : string){
    return this.http.post<any>(`${this.apiUrl}/changePassword`, {newPassword});
  }
  checkLogin(): boolean {
    return !!localStorage.getItem('token');
  }
}
