import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from '../../core/services/cart';
import { Account } from '../../core/services/account';
import { OrderService } from '../../core/services/order';
import { OrderRequestDTO } from '../../models/order.model';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html'
})
export class Checkout implements OnInit {
  cartService = inject(Cart);
  accountService = inject(Account);
  orderService = inject(OrderService);
  userService = inject(UserService); 
  private router = inject(Router);

  deliveryAddress = signal<string>('');
  paymentMethod = signal<'COD' | 'ONLINE'>('COD');
  isPlacingOrder = signal<boolean>(false);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    if (this.cartService.items().length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    const custId = this.accountService.getUserId();
    if (custId) {
      this.userService.getProfile(custId).subscribe({
        next: (user) => this.deliveryAddress.set(user.userAdd || ''),
        error: () => this.deliveryAddress.set('Primary Account Address')
      });
    }
  }

  handlePayment(): void {
    if (this.paymentMethod() === 'ONLINE') {
      this.launchPaymentGateway();
    } else {
      this.submitOrder('COD');
    }
  }

  private launchPaymentGateway(): void {
    this.isPlacingOrder.set(true);
    
    setTimeout(() => {
      const paymentSuccess = true; 
      if (paymentSuccess) {
        this.submitOrder('ONLINE', 'TXN_' + Date.now());
      } else {
        this.errorMessage.set('Payment was cancelled or failed.');
        this.isPlacingOrder.set(false);
      }
    }, 1500);
  }

  private submitOrder(paymentMode: string, transactionId?: string): void {
    this.isPlacingOrder.set(true);
    const custId = Number(this.accountService.getUserId()) || 0;

    const payload: OrderRequestDTO = {
      custId: custId,
      cartDTOs: this.cartService.items().map(item => ({
        prodId: item.id,
        quantity: item.quantity
      }))
      // Pass paymentMode 
    };

    this.orderService.placeOrder(payload).subscribe({
      next: (res: any) => {
        this.isPlacingOrder.set(false);
        const orderId = res?.orderId || res?.id || Math.floor(100000 + Math.random() * 900000);
        this.cartService.clearCart();
        
        this.router.navigate(['/order-success'], { state: { orderId: orderId } });
      },
      error: (err) => {
        this.errorMessage.set(err.error || 'Failed to place order. Please try again.');
        this.isPlacingOrder.set(false);
      }
    });
  }
}