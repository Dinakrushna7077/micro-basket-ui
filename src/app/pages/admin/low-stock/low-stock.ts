import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { LowStockDTO } from '../../../models/product.model';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './low-stock.html',
  styleUrl: './low-stock.css'
})
export class LowStock implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  items: LowStockDTO[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadLowStock();
  }

  loadLowStock(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getLowStockProducts().subscribe({
      next: (res) => {
        this.items = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Low stock API error:', err);
        this.errorMessage = 'Failed to load low stock products.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStockClass(qty: number): string {
    if (qty === 0) return 'badge-danger';
    if (qty <= 5) return 'badge-warning';
    return 'badge-info';
  }
}