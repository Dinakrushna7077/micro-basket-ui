// cart.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Cart } from '../../core/services/cart';
import { Account } from '../../core/services/account';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartPage {
  cartService = inject(Cart);
  accountService = inject(Account);
  private router = inject(Router);

  errorMessage = '';

  increaseQty(id: number, currentQty: number, maxStock: number): void {
    if (currentQty < maxStock) {
      this.cartService.updateQuantity(id, currentQty + 1);
    }
  }

  decreaseQty(id: number, currentQty: number): void {
    this.cartService.updateQuantity(id, currentQty - 1);
  }

  removeItem(id: number): void {
    this.cartService.removeFromCart(id);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  checkout(): void {
    this.errorMessage = '';

    if (!this.accountService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.cartService.items().length === 0) {
      this.errorMessage = 'Your cart is empty.';
      return;
    }

    this.router.navigate(['/checkout']);
  }
}