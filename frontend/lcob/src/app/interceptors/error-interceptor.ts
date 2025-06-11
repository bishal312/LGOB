import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../services/auth/auth';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService=inject(Auth)
  return next(req).pipe(
    catchError((error:HttpErrorResponse)=>{
      if(error.status===401 && !req.url.includes("/auth/refresh-token")){
        return authService.refreshAccessToken().pipe(
          switchMap((newToken:string)=>{
               localStorage.setItem('accessToken',newToken);
               const newreq = req.clone({
                 setHeaders: {
                   Authorization: `Bearer ${newToken}`,
                 },
               })
               return next(newreq)
          }),catchError((error:HttpErrorResponse)=>{
              console.error('Refresh failed', error);
            return throwError(() => error)
          })

        )
      }
      return throwError(() => error)
    })
  )
};
