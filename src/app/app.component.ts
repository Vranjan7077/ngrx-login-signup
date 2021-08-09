import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { autoLogin } from './components/auth/states/auth.actions';
import { AppState } from './store/app.store';
import { getErrorMessage, getLoading } from './store/shared/shared.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showloading!: Observable<boolean>;
  errorMessage!: Observable<string>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.loading();
    this.error();
    this.autoLogin();
  }

  loading() {
    this.showloading = this.store.select(getLoading);
  }
  error() {
    this.errorMessage = this.store.select(getErrorMessage);
  }

  autoLogin() {
    this.store.dispatch(autoLogin());
  }
}
