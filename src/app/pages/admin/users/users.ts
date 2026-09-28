import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Admin } from '../../../core/services/admin';
import { UserListDTO } from '../../../models/admin.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
  private adminService = inject(Admin);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  users: UserListDTO[] = [];
  loading = true;
  errorMessage = '';

  // Track which specific user row is mid-update, to disable just that button
  updatingUserId: number | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Users API error:', err);
        this.errorMessage = 'Failed to load user list.';
        this.loading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/server-error']);
      }
    });
  }

  toggleAccess(user: UserListDTO): void {
    const newStatus = !user.status;
    this.updatingUserId = user.id;

    this.adminService.modifyUserAccess(user.id, newStatus).subscribe({
      next: () => {
        user.status = newStatus; // update UI immediately on success
        this.updatingUserId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Modify access error:', err);
        alert('Failed to update user access. Please try again.');
        this.updatingUserId = null;
        this.cdr.detectChanges();
      }
    });
  }
}