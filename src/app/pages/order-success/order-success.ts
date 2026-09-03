import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-success.html'
})
export class OrderSuccess {
  private router = inject(Router);
  
  orderId: string | number = history.state?.orderId || 'N/A';

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  goToMyOrders(): void {
    this.router.navigate(['/my-orders']);
  }
}