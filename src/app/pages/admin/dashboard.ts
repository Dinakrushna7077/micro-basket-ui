import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Admin } from '../../core/services/admin';
import { DashboardResponse } from '../../models/admin.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private adminService = inject(Admin);
  private cdr = inject(ChangeDetectorRef);   
  private router = inject(Router);
  loading = true;
  errorMessage = '';
  data: DashboardResponse | null = null;

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminService.getDashboard().subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
        this.cdr.detectChanges();   
      },
      error: (err) => {
        console.error('Dashboard API error:', err);
        this.errorMessage = 'Failed to load dashboard data.';
        this.loading = false;
        this.cdr.detectChanges(); 
        this.router.navigate(['/server-error']);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'cancelled': return 'badge-danger';
      case 'shipped': return 'badge-info';
      default: return 'badge-secondary';
    }
  }
}