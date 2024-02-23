import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://www.bazarapi.somee.com/api/Usuarios/SignUp';
  private loginUrl = 'https://www.bazarapi.somee.com/api/Usuarios/Login';
  private resetPasswordUrl = 'https://www.bazarapi.somee.com/api/Usuarios/ForgotPassword';
  private resetPassword2 = 'https://www.bazarapi.somee.com/api/Usuarios/ResetPassword';

  constructor(private http: HttpClient) { }

  signUp(user: any): Observable<any> {
    return this.http.post(this.baseUrl, user);
  }

  login(loginData: { email: string, password: string }): Observable<any> {
    return this.http.post(this.loginUrl, loginData);
  }

  forgotPassword(email: string): Observable<any> {
    const body = { email: email };

    return this.http.post(`${this.resetPasswordUrl}`, body);
  }
  

  resetPassword(resetData: { email: string, token: string, newPassword: string }): Observable<any> {
    return this.http.post(`${this.resetPassword2}`, resetData);
  }
}
