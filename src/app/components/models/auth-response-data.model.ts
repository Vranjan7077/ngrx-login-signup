export interface AuthResponseData {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  email: string;
  localId: string;
  registered?: boolean;
}
