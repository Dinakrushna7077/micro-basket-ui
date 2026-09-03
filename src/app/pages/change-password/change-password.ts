import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user';
import { ChangePasswordDTO } from '../../models/customer.model';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './change-password.html'
})
export class ChangePassword implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);

  passwordForm!: FormGroup;
  userId = signal<number | null>(null);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    const storedId = localStorage.getItem('userId');
    const id = routeId ? +routeId : (storedId ? +storedId : null);

    if (id) {
      this.userId.set(id);
    } else {
      this.errorMessage.set('User session not found.');
    }

    this.initForm();
  }

  private initForm(): void {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.passwordForm.invalid || !this.userId()) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const payload: ChangePasswordDTO = {
      id: this.userId()!,
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword,
      confirmPassword: this.passwordForm.value.confirmPassword
    };

    this.userService.changePassword(payload).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        this.successMessage.set(res || 'Password changed successfully!');
        setTimeout(() => {
          this.router.navigate(['/profile', this.userId()]);
        }, 5000);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(typeof err.error === 'string' ? err.error : 'Failed to update password. Check your current password.');
      }
    });
  }
}