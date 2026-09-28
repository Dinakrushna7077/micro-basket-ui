import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink,Router } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  products: Product[] = [];
  loading = true;
  errorMessage = '';
  searchTerm = '';

  ngOnInit(): void {
    this.loadProducts();
  }
  getImageUrl(imagePath: string): string {
    return this.productService.getImageUrl(imagePath);
  }
  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getAllProducts("desc").subscribe({
      next: (res) => {
        this.products = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Products API error:', err);
        this.errorMessage = 'Failed to load products.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    const keyword = this.searchTerm.trim();

    if (!keyword) {
      this.loadProducts();
      return;
    }

    this.loading = true;
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

  getStockClass(qty: number): string {
    if (qty === 0) return 'badge-danger';
    if (qty <= 10) return 'badge-warning';
    return 'badge-success';
  }
}