import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart } from '../../core/services/cart';
import { Account } from '../../core/services/account';
import { OrderService } from '../../core/services/order';
import { OrderRequestDTO } from '../../models/order.model';
import { UserService } from '../../core/services/user';
import { OrderPaymentDTO, VerifyPaymentDTO } from '../../models/payment.model';

declare var Razorpay: any;

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

  private customerEmail = 'customer@microbasket.com';
  private customerName = 'Customer';

  ngOnInit(): void {
    if (this.cartService.items().length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    const custId = this.accountService.getUserId();
    if (custId) {
      this.userService.getProfile(custId).subscribe({
        next: (user) => {
          this.deliveryAddress.set(user.userAdd || '');
          if (user.userEmail) {
            this.customerEmail = user.userEmail;
          }
          if (user.userName) {
            this.customerName = user.userName;
          }
        },
        error: () => this.deliveryAddress.set('Primary Account Address')
      });
    }
  }

  handlePayment(): void {
    this.errorMessage.set('');
    this.submitOrder(this.paymentMethod());
  }

  private submitOrder(paymentMode: 'COD' | 'ONLINE'): void {
    this.isPlacingOrder.set(true);
    const custId = Number(this.accountService.getUserId()) || 0;

    const payload: OrderRequestDTO = {
      custId: custId,
      cartDTOs: this.cartService.items().map(item => ({
        prodId: item.id,
        quantity: item.quantity
      }))
    };

    this.orderService.placeOrder(payload).subscribe({
      next: (res: any) => {
        let rawId = res;
        try {
          if (typeof res === 'string' && (res.startsWith('{') || res.startsWith('['))) {
            rawId = JSON.parse(res);
          }
        } catch {}

        const numericOrderId = Number(rawId?.orderId || rawId?.id || rawId) || Math.floor(100000 + Math.random() * 900000);

        if (paymentMode === 'ONLINE') {
          this.launchRazorpayCheckout(numericOrderId, this.cartService.totalPrice());
        } else {
          this.finishOrder(numericOrderId);
        }
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || err.error || 'Failed to place order. Please try again.');
        this.isPlacingOrder.set(false);
      }
    });
  }

  private launchRazorpayCheckout(orderId: number, amount: number): void {
    const orderDto: OrderPaymentDTO = {
      amount: amount,
      orderId: orderId
    };

    this.orderService.createPaymentOrder(orderDto).subscribe({
      next: (paymentOrder) => {
        const options = {
          key: paymentOrder.keyId,
          amount: Math.round(paymentOrder.amount * 100),
          currency: paymentOrder.currency || 'INR',
          name: 'MicroBasket',
          description: `Payment for Order #${orderId}`,
          order_id: paymentOrder.razorpayOrderId,
          handler: (response: any) => {
            const verifyDto: VerifyPaymentDTO = {
              orderId: orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            };
            this.verifyRazorpayPayment(verifyDto);
          },
          prefill: {
            name: this.customerName,
            email: this.customerEmail,
            contact: '9999999999'
          },
          theme: {
            color: '#0d6efd'
          },
          modal: {
            ondismiss: () => {
              this.isPlacingOrder.set(false);
              this.errorMessage.set('Payment was cancelled. Your order remains unpaid.');
            }
          }
        };

        const rzp = new Razorpay(options);

        rzp.on('payment.failed', (resp: any) => {
          this.isPlacingOrder.set(false);
          this.errorMessage.set(resp.error?.description || 'Payment failed. Please try another payment method.');
        });

        rzp.open();
      },
      error: (err) => {
        this.isPlacingOrder.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to initialize payment gateway.');
      }
    });
  }

  private verifyRazorpayPayment(dto: VerifyPaymentDTO): void {
    this.orderService.verifyPayment(dto).subscribe({
      next: () => {
        this.finishOrder(dto.orderId);
      },
      error: (err) => {
        this.isPlacingOrder.set(false);
        this.errorMessage.set(err.error?.message || 'Payment verification failed. Please contact support.');
      }
    });
  }

  private finishOrder(orderId: number): void {
    this.isPlacingOrder.set(false);
    this.cartService.clearCart();
    this.router.navigate(['/order-success'], { state: { orderId: orderId } });
  }
}