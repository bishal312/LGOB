import { HttpInterceptorFn } from '@angular/common/http';

export const authorizeInterceptor: HttpInterceptorFn = (req, next) => {
  const token=localStorage.getItem('acesstoken')
  if (token != null) {
    const tokenData=JSON.parse(token)
   const  newreq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenData}`,
      },
    });
    return next(newreq);
  } else{
    return next(req);
  }
};
