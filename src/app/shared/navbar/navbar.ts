import { Component, inject, Injectable, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Account } from '../../core/services/account';
import { Cart } from '../../core/services/cart';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  accountService = inject(Account);
  private router = inject(Router);
  cartService = inject(Cart);

  cartCount = 0;
  
  logout(): void {
    this.accountService.logout();
    this.router.navigate(['/login']);
  }
}