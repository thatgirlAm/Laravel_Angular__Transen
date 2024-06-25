import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');  
  
  if (token) {
    const cloned = req.clone({
        setHeaders: {
            Authorization:`Bearer ${token}`
        }
    });
    return next(cloned);
  } else {
    return next(req);
  }
};
