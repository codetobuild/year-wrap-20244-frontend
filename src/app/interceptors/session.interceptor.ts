// src/app/interceptors/session.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  // Only add sessionId header if it exists in localStorage
  const sessionId = localStorage.getItem('sessionId');

  let modifiedReq = req;
  if (sessionId) {
    modifiedReq = req.clone({
      headers: req.headers.set('x-session-id', sessionId),
    });
  }

  return next(modifiedReq).pipe(
    tap({
      next: (response) => {
        // Check response headers for session ID
        if (response && 'headers' in response) {
          const newSessionId = response.headers.get('x-session-id');
          if (newSessionId) {
            localStorage.setItem('sessionId', newSessionId);
          }
        }
      },
    })
  );
};
