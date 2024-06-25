import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

export const AntiAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

    if(auth.checkLogin()) {
        router.navigateByUrl('/dashboard');
        alert('Action non authorisée.');
        //console.log('Access denied');
        return false;
    }
    //console.log('Access granted');
    return true;
};
