// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignUp } from '../pages/sign-up';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api/users';

  constructor(private http: HttpClient) { }

  signup(signupData: SignUp): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, signupData);
  }

  getBalance(userId: number | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getBalance/${userId}`);
  }

  findUserByNumber(number: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/findByNumber/${number}`);
  }


}
