import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardResponse, UserListDTO } from '../../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class Admin {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Admin`;

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.baseUrl}/dashboard`);
  }

  getUsers(): Observable<UserListDTO[]> {
    return this.http.get<UserListDTO[]>(`${this.baseUrl}/users`);
  }

  modifyUserAccess(uid: number, status: boolean): Observable<string> {
    return this.http.get(`${this.baseUrl}/modify-access/${uid}/${status}`, { responseType: 'text' });
  }
}