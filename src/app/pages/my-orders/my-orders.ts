import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order';
import { Account } from '../../core/services/account';
import { OrderListDTO } from '../../models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css'
})
export class MyOrders implements OnInit {
  private orderService = inject(OrderService);
  private accountService = inject(Account);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  orders: OrderListDTO[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    const uid = this.accountService.getUserId();

    if (!uid) {
      this.errorMessage = 'Unable to determine your account. Please log in again.';
      this.loading = false;
      return;
    }

    this.loadOrders(uid);
  }

  loadOrders(uid: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getMyOrders(uid).subscribe({
      next: (res) => {
        this.orders = res.sort((a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('My orders error:', err);
        this.errorMessage = 'Failed to load your orders.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewDetails(orderId: number): void {
    this.router.navigate(['/order-details', orderId]);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'cancelled': return 'badge-danger';
      case 'confirmed': return 'badge-info';
      case 'shipped': return 'badge-primary';
      default: return 'badge-secondary';
    }
  }
}