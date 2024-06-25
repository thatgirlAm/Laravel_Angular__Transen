import { HttpInterceptorFn } from '@angular/common/http';

export const authentificationInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
    const cloned = req.clone({
        setHeaders: {
            Authorization:`Bearer ${token}`
        }
    });
  return next(cloned);
};
