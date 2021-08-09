import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  autoLogin,
  autoLogout,
  loginStart,
  loginSuccess,
  signupStart,
  signupSuccess,
} from './auth.actions';
import { catchError, exhaustMap, tap, map, mergeMap } from 'rxjs/operators';
import { AuthService } from 'src/app/service/auth.service';
import { AppState } from 'src/app/store/app.store';
import { Store } from '@ngrx/store';
import {
  setErrorMessage,
  setLoadingSpinner,
} from 'src/app/store/shared/shared.actions';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loginStart),
      exhaustMap((action) => {
        return this.authService.login(action.email, action.password).pipe(
          map((data) => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            this.store.dispatch(setErrorMessage({ message: '' }));
            const user = this.authService.formatUser(data);
            this.authService.setUserInLocalStorage(user);
            return loginSuccess({ user, redirect: true });
          }),
          catchError((err) => {
            var errorMessageText = err.error.error.message;
            this.store.dispatch(setLoadingSpinner({ status: false }));
            const errorMessage =
              this.authService.getErrorMessage(errorMessageText);
            return of(setErrorMessage({ message: errorMessage }));
          })
        );
      })
    );
  });

  loginRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(loginSuccess),
        tap((action) => {
          this.store.dispatch(setErrorMessage({message:''}));
          if(action.redirect){
            this.router.navigate(['/']);
          }
        })
      );
    },
    { dispatch: false }
  );

  signup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(signupStart),
      exhaustMap((action) => {
        return this.authService.signup(action.email, action.password).pipe(
          map((data) => {
            this.store.dispatch(setLoadingSpinner({ status: false }));
            this.store.dispatch(setErrorMessage({ message: '' }));
            const user = this.authService.formatUser(data);
            console.log(user);
            this.authService.setUserInLocalStorage(user);
            return signupSuccess({ user,redirect:true });
          }),
          catchError((err) => {
            var errorMessageText = err.error.error.message;
            this.store.dispatch(setLoadingSpinner({ status: false }));
            const errorMessage =
              this.authService.getErrorMessage(errorMessageText);
            return of(setErrorMessage({ message: errorMessage }));
          })
        );
      })
    );
  });

  signUpRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(signupSuccess),
        tap((action) => {
          this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  autoLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(autoLogin),
      mergeMap((action) => {
        const user: any = this.authService.getUserInLocalStorage();
        return of(loginSuccess({ user,redirect:false }));
      })
    );
  });

  logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(autoLogout),
        map((action) => {
          this.authService.logout();
          this.router.navigate(['auth']);
        })
      );
    },
    { dispatch: false }
  );
}
