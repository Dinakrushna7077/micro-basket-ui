import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user';

export interface Customer {
  id: number;
  userName: string;
  userAdd: string;
  userPhone: string;
  userEmail: string;
  status: boolean;
  createdDate: string;
  updatedDate: string | null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  private route = inject(ActivatedRoute);
  private customerService = inject(UserService);

  customer = signal<Customer | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCustomerProfile(+id);
    } else {
      this.errorMessage.set('No user ID provided.');
      this.isLoading.set(false);
    }
  }

  loadCustomerProfile(id: number): void {
    this.isLoading.set(true);
    this.customerService.getProfile(id).subscribe({
      next: (data) => {
        this.customer.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load profile details.');
        this.isLoading.set(false);
      }
    });
  }
}