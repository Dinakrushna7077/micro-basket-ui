import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order';
import { OrderListDTO, ALL_ORDER_STATUSES } from '../../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  orders: OrderListDTO[] = [];
  loading = true;
  errorMessage = '';

  allStatuses = ALL_ORDER_STATUSES;
  activeFilter = 'all';
  filterTabs = ['all', ...ALL_ORDER_STATUSES];

  // Track which order row is mid-update, to disable just that dropdown
  updatingOrderId: number | null = null;

  ngOnInit(): void {
    this.loadOrders(this.activeFilter);
  }

  loadOrders(status: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.activeFilter = status;

    this.orderService.filterOrders(status).subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Orders API error:', err);
        this.errorMessage = 'Failed to load orders.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onStatusChange(order: OrderListDTO, newStatus: string): void {
    if (newStatus === order.orderStatus) return; // no actual change

    const previousStatus = order.orderStatus;
    this.updatingOrderId = order.orderId;

    this.orderService.updateOrderStatus({
      id: order.orderId,
      custId: order.custId,
      status: newStatus
    }).subscribe({
      next: () => {
        order.orderStatus = newStatus; // reflect immediately
        this.updatingOrderId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Update status error:', err);
        alert('Failed to update order status. Please try again.');
        order.orderStatus = previousStatus; // revert dropdown on failure
        this.updatingOrderId = null;
        this.cdr.detectChanges();
      }
    });
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