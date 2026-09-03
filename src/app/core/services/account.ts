import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class Account {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Account`;

  userId = signal<string | null>(localStorage.getItem('userId'));
  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));
  userName = signal<string | null>(localStorage.getItem('userName'));
  role = signal<string | null>(localStorage.getItem('role'));

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId.toString());
        localStorage.setItem('userName', response.userName);
        localStorage.setItem('userEmail', response.userEmail);
        localStorage.setItem('role', response.role);

        this.isLoggedIn.set(true);
        this.userName.set(response.userName);
        this.role.set(response.role);
      })
    );
  }

  register(data: RegisterRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, data, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');

    this.isLoggedIn.set(false);
    this.userName.set(null);
    this.role.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  getUserId(): number | null {
  const id = localStorage.getItem('userId');
  return id ? Number(id) : null;
}
}