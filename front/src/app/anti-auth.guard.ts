import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const AntiAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
    if(auth.checkLogin()) {
        router.navigateByUrl('/history');
        //console.log('Access denied');
        return false;
    }
    //console.log('Access granted');
    return true;
};
