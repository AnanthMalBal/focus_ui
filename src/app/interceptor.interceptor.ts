import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './modules/auth/services/auth.service';
import { AuthModel } from './modules/auth/models/auth.model';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.getAuthFromLocalStorage(); // Get token from localStorage
    console.log('Interceptor:', auth);
    if (auth && auth.authToken) {
      // Clone the request and add the authorization header
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', `${auth.authToken}`),  // No "Bearer"
      });
      console.log('Interceptor: Authenticated request', clonedRequest);
      return next.handle(clonedRequest);
    }

    // If no token, proceed with the original request
    return next.handle(req);
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      return lsValue ? JSON.parse(lsValue) : undefined;
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return undefined;
    }
  }
}
