import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token/token.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
const tokenService = inject(TokenService);
  const router = inject(Router);

  const roles = tokenService.userRoles;

  if (roles && (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN'))) {
    return true;
  }

  router.navigate(['/books']);
  return false;
};
