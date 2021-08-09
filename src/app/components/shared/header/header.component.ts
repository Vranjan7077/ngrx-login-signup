import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store/app.store';
import { autoLogout } from '../../auth/states/auth.actions';
import { isAuthenticated } from '../../auth/states/auth.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuthenticated!:Observable<boolean>;
  constructor(private store :Store<AppState>) { }

  ngOnInit(): void {
    this.getAuthValue();
  }


  getAuthValue(){
    this.isAuthenticated = this.store.select(isAuthenticated);
  }

  onLogout(event : Event){
    event.preventDefault();
    this.store.dispatch(autoLogout());
  }

}
