import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../../models/cart.model';
import { Product } from '../../models/product.model';

const CART_STORAGE_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class Cart {
  items = signal<CartItem[]>(this.loadFromStorage());

  totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity * item.productPrice, 0)
  );

  private loadFromStorage(): CartItem[] {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private saveToStorage(): void {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items()));
  }

  isExisting(product: Product) {
    const existing = this.items().find(i => i.id === product.id);
    if (existing)
      return true;
    return false
  }
  addToCart(product: Product, quantity: number = 1): void {
    const current = this.items();

    
      const newItem: CartItem = {
        id: product.id,
        productName: product.productName,
        productPrice: product.productPrice,
        productImage: product.productImage,
        quantity: Math.min(quantity, product.productQuantity),
        availableStock: product.productQuantity
      };
      this.items.set([...current, newItem]);
    

    this.saveToStorage();
  }

  updateQuantity(id: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(id);
      return;
    }

    this.items.set(
      this.items().map(i =>
        i.id === id ? { ...i, quantity: Math.min(quantity, i.availableStock) } : i
      )
    );
    this.saveToStorage();
  }

  removeFromCart(id: number): void {
    this.items.set(this.items().filter(i => i.id !== id));
    this.saveToStorage();
  }

  clearCart(): void {
    this.items.set([]);
    sessionStorage.removeItem(CART_STORAGE_KEY);
  }
}