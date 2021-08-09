import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.store';
import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import { loginStart } from '../states/auth.actions';
// import { AuthState } from '../states/auth.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<AppState> // public authService: AuthService // public auth: AngularFireAuth,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          // Validators.pattern(Regex.email_regex),
        ],
      ],
      password: [
        '',
        [
          Validators.minLength(5),
          Validators.maxLength(20),
          Validators.required,
          //Validators.pattern(Regex.password),
        ],
      ],
    });
  }

  onLoginSubmit() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.store.dispatch(setLoadingSpinner({ status: true }));
    this.store.dispatch(loginStart({ email, password }));
  }
}
