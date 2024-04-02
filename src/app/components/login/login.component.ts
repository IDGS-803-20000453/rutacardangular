import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private apiService: ApiService, private authService: AuthService, private router: Router) { }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, complete ambos campos.';
      return;
    }

    this.apiService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          this.authService.login(response);

          const user = this.authService.currentUserValue;

          if (user?.rolId === 2) { // Cliente
            this.router.navigate(['/']);
          } else if (user?.rolId === 1) { // Admin
            this.router.navigate(['/admin']);
          } else {
            // Manejar otros roles o redirigir a una página de error
          }
          console.log(response);
        },
        error: (error) => {
          console.error(error);
          if (error.status === 401) {
            this.errorMessage = 'Credenciales inválidas. Por favor, verifique su email y contraseña.';
          } else {
            this.errorMessage = 'Se produjo un error al intentar iniciar sesión. Por favor, inténtelo de nuevo más tarde.';
          }
        }
      });
  }
}
