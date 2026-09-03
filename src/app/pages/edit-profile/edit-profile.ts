import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-profile.html'
})
export class ProfileEdit implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(UserService);

  profileForm!: FormGroup;
  userId = signal<number | null>(null);
  isLoading = signal<boolean>(true);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId.set(+id);
      this.loadCustomerData(+id);
    } else {
      this.errorMessage.set('Invalid User ID.');
      this.isLoading.set(false);
    }
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      userEmail: ['', [Validators.required, Validators.email]],
      userPhone: ['', [Validators.required, Validators.pattern('^[0-9+\\-\\s()]{7,20}$')]],
      userAdd: ['', [Validators.required]],
      status: [true]
    });
  }

  private loadCustomerData(id: number): void {
    this.customerService.getProfile(id).subscribe({
      next: (data: Customer) => {
        this.profileForm.patchValue({
          userName: data.userName,
          userEmail: data.userEmail,
          userPhone: data.userPhone,
          userAdd: data.userAdd,
          status: data.status
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load profile details.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // 1. Build the full Customer payload including the id and createdDate
const updatedData: Customer = {
  id: this.userId()!,
  userName: this.profileForm.value.userName,
  userEmail: this.profileForm.value.userEmail,
  userPhone: this.profileForm.value.userPhone,
  userAdd: this.profileForm.value.userAdd,
  status: this.profileForm.value.status,
  createdDate:  new Date().toISOString(),
  updatedDate: new Date().toISOString()
};

// 2. Pass only the updatedData object (1 argument)
this.customerService.updateCustomer(updatedData).subscribe({
  next: (res) => {
    this.isSaving.set(false);
    this.successMessage.set(res || 'Profile updated successfully!');
    setTimeout(() => {
      this.router.navigate(['/profile', this.userId()]);
    }, 1200);
  },
  error: (err) => {
    this.isSaving.set(false);
    this.errorMessage.set(typeof err.error === 'string' ? err.error : 'Failed to update profile. Please try again.');
  }
});
  }
}