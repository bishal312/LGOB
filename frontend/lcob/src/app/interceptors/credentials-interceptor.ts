import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const newreq= req.clone({
    withCredentials: true
  })
  return next(newreq);
};
