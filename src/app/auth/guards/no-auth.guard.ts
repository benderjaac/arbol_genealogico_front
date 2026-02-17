import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { of } from 'rxjs';

export const NoAuthGuard: CanActivateFn | CanActivateChildFn= (route, state) => {
  const _authService = inject(AuthService);
  const router: Router = inject(Router);
  
  if(_authService._authenticated()){
    return of(router.parseUrl('inicio'));
  }
  return of(true);  
};
