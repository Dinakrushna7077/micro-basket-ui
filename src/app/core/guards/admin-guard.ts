import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Account } from '../services/account';

export const adminGuard: CanActivateFn = () => {
  const accountService = inject(Account);
  const router = inject(Router);

  if (!accountService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (accountService.role() !== 'Admin') {
    router.navigate(['/']);
    return false;
  }

  return true;
};