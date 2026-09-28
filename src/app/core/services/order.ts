import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderDetailsDTO, OrderListDTO, OrderRequestDTO, UpdateOrderDTO } from '../../models/order.model';
import { OrderPaymentDTO, VerifyPaymentDTO } from '../../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Order`;
  private paymentUrl = `${environment.apiUrl}/Payment`;

  filterOrders(status: string): Observable<OrderListDTO[]> {
    return this.http.get<OrderListDTO[]>(`${this.baseUrl}/filter-orders/${status}`);
  }

  updateOrderStatus(data: UpdateOrderDTO): Observable<string> {
    return this.http.patch(`${this.baseUrl}/update-order-status`, data, { responseType: 'text' });
  }

  getMyOrders(uid: number): Observable<OrderListDTO[]> {
    return this.http.get<OrderListDTO[]>(`${this.baseUrl}/all-orders/${uid}`);
  }

  getOrderDetails(oid: number): Observable<OrderDetailsDTO[]> {
    return this.http.get<OrderDetailsDTO[]>(`${this.baseUrl}/order-details/${oid}`);
  }

  placeOrder(data: OrderRequestDTO): Observable<string> {
    return this.http.post(`${this.baseUrl}/place-order`, data, { responseType: 'text' });
  }
// Sends the OrderPaymentDTO model
  createPaymentOrder(dto: OrderPaymentDTO): Observable<any> {
    return this.http.post<any>(`${this.paymentUrl}/create-order`, dto);
  }

  // Sends the VerifyPaymentDTO model
  verifyPayment(dto: VerifyPaymentDTO): Observable<any> {
    return this.http.post<any>(`${this.paymentUrl}/verify-payment`, dto);
  }
}