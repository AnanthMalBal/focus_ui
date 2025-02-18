import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environmentpath } from 'src/app/pages/environments/environments';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;


  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private http: HttpClient,
  ) {

    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();

    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();

    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  private menuSubject = new BehaviorSubject<any[]>([]); // Subject to store menu items
  menu$ = this.menuSubject.asObservable(); // Observable to be subscribed by components

  // public methods
  login(email: string, password: string): Observable<any> {
    console.log("auth", email, password);
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: UserType | undefined) => {

        if (!auth) {
          throw new Error("Authentication response is undefined."); // Guard against undefined auth
        }
        const result = this.setAuthFromLocalStorage(auth);
        console.log("auth--", auth);
        console.log("result--", result);

        // Extract roles and convert to a comma-separated string
        const rolesArray = auth.user?.roles || [];
        const roles = rolesArray.join(','); // Convert array to "Admin, Employee"
        console.log("roles--", roles);

        // Fetch menu after successful login
        this.getmenu(roles);


        return auth;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // getmenu(role: any): Observable<any> {
  //   console.log("roles",role);
  //   return this.http.post(`${environmentpath.menuUrl}`, {roles:role})

  // }

  getmenu(role: string): void {
    console.log('Roles received:',role);
    // Get the auth token from localStorage
    const auth = this.getAuthFromLocalStorage(); // Assuming this method returns the auth object


    // Set up HTTP headers with Authorization
    const httpHeaders = new HttpHeaders({
      Authorization: `${auth ? auth.authToken : ""}`,
    });
    this.http
      .post(`${environmentpath.menuUrl}`, { roles: role }, { headers: httpHeaders })
      .pipe(
        tap((response: any) => {
          console.log('Menu response:', response); // Check the structure
          if (response && response.length > 0) {
            // Emit the received menu items
            this.menuSubject.next(response);
          } else {
            this.menuSubject.next([]); // Emit empty array if no data
          }
        }),
        catchError((error) => {
          console.error('Error fetching menu:', error);
          this.menuSubject.next([]); // Emit empty array on error
          return of([]); // Return an empty array to handle errors gracefully
        })
      )
      .subscribe();
  }



  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserType> {

    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    console.log("getUserByToken", auth)
    this.isLoadingSubject.next(true);
    return this.authHttpService.getUserByToken(auth.authToken).pipe(
      map((user: UserType) => {
        if (user) {
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<any> {
    // this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email).pipe(
        map((result) => {
          console.log("in fp service",result.passwordtoken)
          const passwordtoken = result.passwordtoken
          localStorage.setItem('passwordToken', passwordtoken);
          // this.isLoadingSubject.next(false);
        }),
        finalize(() => this.isLoadingSubject.next(false)
        ));
  }

  changePassword(formdata: any): Observable<any> {
    console.log("changepassword", formdata)
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .changePassword(formdata)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: UserType): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    console.log("SetAuth", auth);
    if (auth && auth.authToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
