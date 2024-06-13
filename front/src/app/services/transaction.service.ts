// src/app/services/transaction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  findUserByNumber(number: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/findByNumber/${number}`);
  }
  getTransactionsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/history/${userId}`);
  }
  validateTransaction(transaction: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/transactions/validateTransaction`, transaction);
  }


  getTransactionHistory(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/history/${userId}`);
  }

  requestPasswordConfirmation(userId: number, number: string | null, password: string): Observable<any> {
    const userData = { number, password };
    return this.http.post(`${this.apiUrl}/users/history/${userId}/reverse`, userData);
  }

  reverseTransaction(idTransaction: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/transactions/${idTransaction}`);
  }
}
