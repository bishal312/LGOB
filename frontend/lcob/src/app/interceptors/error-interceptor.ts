import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, EmptyError, finalize, switchMap, throwError } from 'rxjs';
import { Auth } from '../services/auth/auth';
import { Router } from '@angular/router';
import { Loader } from '../mat-services/loader/loader';
import { DialogBox } from '../services/dialog/dialog-box';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const loaderService=inject(Loader)
  loaderService.isLoading.next(true)
 const  dialogBox=inject(DialogBox)
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      //!req.url is check so, it not run infinitely
      if (error.status === 401 && !req.url.includes('/refresh-token')) {

        // this type of window check insures the code only runs in the browser
        if (typeof window !== 'undefined') {
        return  dialogBox.open(error.error.message,'Refresh Token Expired').pipe(
          switchMap((isContinue:boolean) => {
            if(!isContinue){
              router.navigate(['/login'])
              return EMPTY
            }
            return authService.refreshAccessToken().pipe(
              switchMap(() => {
                const retryReq = req.clone({ withCredentials: true });
                return next(retryReq);
              }),
              catchError(refreshErr => {
                return throwError(() => refreshErr);
              }),
              finalize(() => loaderService.isLoading.next(false))
            );
          })
        );

      }
    }

      return throwError(() => error);
    }),
  finalize(() => loaderService.isLoading.next(false))
  );
};
