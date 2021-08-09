import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/service/auth.service';
import { AppState } from 'src/app/store/app.store';
import { setLoadingSpinner } from 'src/app/store/shared/shared.actions';
import { signupStart } from '../states/auth.actions';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.signupForm = this.fb.group({
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
          // Validators.pattern(Regex.password),
        ],
      ],
    });
  }

  onSignup() {
    if (!this.signupForm.valid) {
      return;
    }
    const email = this.signupForm.value.email;
    const password = this.signupForm.value.password;
    this.store.dispatch(setLoadingSpinner({ status: true }));
    this.store.dispatch(
      signupStart({
        email,
        password,
      })
    );
  }
}
