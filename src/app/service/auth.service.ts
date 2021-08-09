import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { autoLogout } from '../components/auth/states/auth.actions';
import { AuthResponseData } from '../components/models/auth-response-data.model';
import { User } from '../components/models/user.model';
import { AppState } from '../store/app.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private BASE_URL = 'https://identitytoolkit.googleapis.com/v1';

  timeOutInterval: any;

  constructor(private _http: HttpClient, private store: Store<AppState>) {}

  login(email: string, password: string): Observable<AuthResponseData> {
    return this._http.post<AuthResponseData>(
      `${this.BASE_URL}/accounts:signInWithPassword?key=${environment.firebaseConfig.apiKey}`,
      { email, password, returnSecureToken: true }
    );
    // .pipe(catchError(this.errorHandler));
  }

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this._http.post<AuthResponseData>(
      `${this.BASE_URL}/accounts:signUp?key=${environment.firebaseConfig.apiKey}`,
      { email, password, returnSecureToken: true }
    );
  }

  logout() {
    localStorage.removeItem('userData');
    if (this.timeOutInterval) {
      clearTimeout(this.timeOutInterval);
      this.timeOutInterval = null;
    }
  }

  formatUser(data: AuthResponseData) {
    const expirationDate = new Date(
      new Date().getTime() + +data.expiresIn * 1000
    );
    const user = new User(
      data.email,
      data.idToken,
      data.localId,
      expirationDate
    );
    return user;
  }

  setUserInLocalStorage(user: User) {
    localStorage.setItem('userData', JSON.stringify(user));
    this.runTimeOutInterval(user);
  }

  runTimeOutInterval(user: User) {
    const todayDate = new Date().getTime();
    const expiratonDate = user.expireDate.getTime();
    const timeInterval = expiratonDate - todayDate;
    this.timeOutInterval = setTimeout(() => {
      this.store.dispatch(autoLogout());
    }, timeInterval);
  }

  getUserInLocalStorage() {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const expirationDate = new Date(userData.expirationDate);
      const user = new User(
        userData.email,
        userData.token,
        userData.localId,
        expirationDate
      );
      this.runTimeOutInterval(user);
      return user;
    }
    return null;
  }

  getErrorMessage(message: string) {
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        return 'Email not found in the database';
      case 'INVALID_PASSWORD':
        return 'Invalid password, try again !!!';
      case 'USER_DISABLED':
        return 'Your email id is disabled. Check again before trying';

      case 'EMAIL_EXISTS':
        return 'You email already exists. Try login';
      case 'OPERATION_NOT_ALLOWED':
        return 'Password signin is disabled for your account';
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        return 'Due to many requests we have blocked the service';

      default:
        return 'Unknown error occurred';
    }
  }

  // errorHandler(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     console.error(
  //       `Backend returned code ${error.status}, ` + `body was: ${error.error}`
  //     );
  //   }
  //   return throwError(
  //     'Something Really Bad Happened here; please try again later.'
  //   );
  // }
}
