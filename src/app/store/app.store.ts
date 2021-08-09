import { AuthReducer } from '../components/auth/states/auth.reducers';
import { AUTH_STATE_NAME } from '../components/auth/states/auth.selectors';
import { AuthState } from '../components/auth/states/auth.state';
import { SharedReducer } from './shared/shared.reducers';
import { SHARED_STATE_NAME } from './shared/shared.selectors';
import { SharedState } from './shared/shared.state';

export interface AppState {
  [SHARED_STATE_NAME]: SharedState;
  [AUTH_STATE_NAME]: AuthState;
}

export const appReducer = {
  [SHARED_STATE_NAME]: SharedReducer,
  [AUTH_STATE_NAME]: AuthReducer,
};
