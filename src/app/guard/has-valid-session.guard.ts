import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/user/login.service';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthResponse } from '../model/auth-response';

export const hasValidSessionGuard: CanActivateFn = (route, state) => {
  const loginService: LoginService = inject(LoginService);
  const router: Router = inject(Router);
  const access_token = localStorage.getItem("access-token");

  if (access_token !== "") {
    return loginService.refresh({
      refresh: localStorage.getItem("refresh-token") ?? ''
    }).pipe(
      map((response: AuthResponse) => {
        localStorage.setItem("access-token", response.access ?? '');
        return true;
      }),
      catchError(() => {
        return of(router.createUrlTree(['/login']));
      })
    );
  } else {
    return of(router.createUrlTree(['/login']));
  }
};
