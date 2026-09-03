import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order';
import { OrderDetailsDTO } from '../../models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetails implements OnInit {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  items: OrderDetailsDTO[] = [];
  loading = true;
  errorMessage = '';
  orderId: number | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.orderId = Number(idParam);
      this.loadDetails(this.orderId);
    }
  }

  loadDetails(oid: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getOrderDetails(oid).subscribe({
      next: (res) => {
        this.items = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Order details error:', err);
        this.errorMessage = 'Failed to load order details.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get grandTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price , 0);
  }

  // All items in one order share the same overall status and date
  get overallStatus(): string {
    return this.items[0]?.orderStatus ?? '';
  }

  get orderDate(): string {
    return this.items[0]?.orderDate ?? '';
  }

  getStatusStep(status: string): number {
    const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
    return steps.indexOf(status?.toLowerCase());
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