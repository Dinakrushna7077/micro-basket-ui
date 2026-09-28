import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChangePasswordDTO, Customer, Profile } from '../../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/User`;

  getProfile(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/profile/${id}`);
  }

  updateCustomer(data: Profile): Observable<string> {
  return this.http.put(`${this.baseUrl}/update-profile`, data, { responseType: 'text' });
}changePassword(data: ChangePasswordDTO): Observable<string> {
  return this.http.patch(`${this.baseUrl}/change-password`, data, { responseType: 'text' });
}
}