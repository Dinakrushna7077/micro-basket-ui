import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { Cart } from '../../core/services/cart';
import { Product } from '../../models/product.model';
import { Navbar } from '../../shared/navbar/navbar';
import { Account } from '../../core/services/account';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  nav=inject(Navbar);
  private account = inject(Account);
  private router = inject(Router);

  cartService = inject(Cart);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Products load error:', err);
        this.errorMessage = 'Failed to load products.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }

  addToCart(event: Event, product: Product): void {
    if(!this.account.isLoggedIn())
    {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(product, 1);
    event.stopPropagation();
    this.nav.cartCount=this.nav.cartCount+1;
  }

  buyNow(event: Event, product: Product): void {
    this.nav.cartCount=this.nav.cartCount+1;
    event.stopPropagation();
    this.cartService.addToCart(product, 1);
    this.router.navigate(['/cart']);
  }
}