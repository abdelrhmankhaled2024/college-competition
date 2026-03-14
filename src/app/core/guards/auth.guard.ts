import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service"

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const mode = route.data?.['mode'] || 'auth';

  if (mode === 'auth') {
    if (auth.isLoggedIn) return true;
    router.navigate(['/login']);
    return false;
  }

  if (mode === 'guest') {
    if (!auth.isLoggedIn) return true;
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
