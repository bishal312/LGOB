import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Loader } from '../mat-services/loader/loader';
import { delay, finalize } from 'rxjs';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService=inject(Loader)
  loaderService.isLoading.next(true)
  const newreq= req.clone({
    withCredentials: true
  })

  
  return next(newreq).pipe(
    finalize(() =>  {
         loaderService.isLoading.next(false)
    })
  );
};
