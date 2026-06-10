import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const currentUser = authService.currentUserValue;

  if (currentUser) {
    if (route.data['roles'] && route.data['roles'].indexOf(currentUser.role) === -1) {
      router.navigate(['/']);
      return false;
    }
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
