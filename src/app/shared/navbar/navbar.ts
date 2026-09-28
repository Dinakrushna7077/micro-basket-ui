import { Component, inject, Injectable, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Account } from '../../core/services/account';
import { Cart } from '../../core/services/cart';
import { FormsModule } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive,FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  accountService = inject(Account);
  private router = inject(Router);
  cartService = inject(Cart);

  cartCount: Signal<number> = this.cartService.cartCount;

  searchTerm = '';

onSearch(): void {
  const keyword = this.searchTerm.trim();

  if (!keyword) {
    return;
  }

  this.router.navigate(['/'], {
    queryParams: { search: keyword }
  });
}
  
  logout(): void {
    this.accountService.logout();
    this.router.navigate(['/login']);
  }
}