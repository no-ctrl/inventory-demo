import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
        toastr.error('Session expired. Please login again.');
      } else if (error.status === 403) {
        toastr.error('You do not have permission to perform this action.');
      } else if (error.status === 400) {
        if (typeof error.error === 'object') {
          Object.values(error.error).forEach((message: any) => {
            toastr.error(message);
          });
        } else {
          toastr.error(error.error || 'Bad request');
        }
      } else {
        toastr.error('An error occurred. Please try again later.');
      }
      return throwError(() => error);
    })
  );
}; 