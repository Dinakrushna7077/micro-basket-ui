import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { Cart } from '../../core/services/cart';
import { Product } from '../../models/product.model';
import { Navbar } from '../../shared/navbar/navbar';
import { Account } from '../../core/services/account';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  nav = inject(Navbar);
  private account = inject(Account);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  cartService = inject(Cart);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  loading = true;
  errorMessage = '';


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const keyword = params['search'];

      if (keyword) {
        this.searchProducts(keyword);
      } else {
        this.loadProducts();
      }
    });
  }
  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts("random").subscribe({
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
        this.router.navigate(['/server-error']);
      }
    });
  }

  getImageUrl(imagePath: string): string {
    return this.productService.getImageUrl(imagePath);
  }
  viewProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }

  addToCart(event: Event, product: Product): void {
    if (!this.account.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.addToCart(product, 1);
    event.stopPropagation();
  }

  buyNow(event: Event, product: Product): void {
    event.stopPropagation();
    if(!this.cartService.isExisting(product)) {
      this.cartService.addToCart(product, 1);
    }
    this.router.navigate(['/cart']);
  }

  searchProducts(keyword: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.searchProducts(keyword).subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Search error:', err);
        this.errorMessage = 'Search failed.';
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/server-error']);
      }
    });
  }
}