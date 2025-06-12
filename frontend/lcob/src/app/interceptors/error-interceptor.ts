import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { Auth } from '../services/auth/auth';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/refresh-token')) {
        // ✅ Check if running in the browser before using confirm()
        if (typeof window !== 'undefined') {
          const isContinue = confirm("Do you want to continue?");
          if (!isContinue) {
            router.navigate(['/login']);
            return throwError(() => error);
          }
        }

        return authService.refreshAccessToken().pipe(
          switchMap(() => {
            const retryReq = req.clone({ withCredentials: true });
            return next(retryReq);
          }),
          catchError(refreshErr => {
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
