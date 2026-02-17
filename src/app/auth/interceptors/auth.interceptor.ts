import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const isAuthEndpoint = req.url.includes('/auth/');

  if (isAuthEndpoint) {
    return next(req);
  }

  const token = localStorage.getItem('auth_token');

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(cloned);
  }

  return next(req);
};
