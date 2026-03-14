import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/**
 * authGuard
 *
 * Placeholder guard — will protect routes once authentication is added.
 * Currently allows all navigation through.
 *
 * TODO: Check auth state from AuthService and redirect to /login if not authenticated.
 */
export const authGuard: CanActivateFn = (_route, _state) => {
  // const auth = inject(AuthService);
  // const router = inject(Router);
  // if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  return true;
};
