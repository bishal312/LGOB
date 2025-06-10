import { HttpInterceptorFn } from '@angular/common/http';

export const authorizeInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
