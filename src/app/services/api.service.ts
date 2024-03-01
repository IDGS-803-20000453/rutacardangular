import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 
  private baseUrl = 'https://localhost/api/Usuarios/SignUp';
  private loginUrl = 'https://localhost/api/Usuarios/Login';
  private resetPasswordUrl = 'https://localhost/api/Usuarios/ForgotPassword';
  private resetPassword2 = 'https://localhost/api/Usuarios/ResetPassword';
  private startVerificationUrl = 'https://localhost:7248/api/Usuarios/StartVerification';
  private completeVerificationUrl = 'https://localhost:7248/api/Usuarios/CompleteRegistration';
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

  startVerification(user: any): Observable<any> {
    return this.http.post(this.startVerificationUrl, user);
  }

  completeVerification(user: any): Observable<any> {
    return this.http.post(this.completeVerificationUrl, user);
  }
}
