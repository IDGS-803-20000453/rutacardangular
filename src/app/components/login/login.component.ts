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

  constructor(private apiService: ApiService, private authService: AuthService, private router: Router) { }

  login() {
    this.apiService.login({ email: this.email, password: this.password })
      .subscribe({
        next: (response) => {
          this.authService.login(response); // Pasa la respuesta al método login
  
          // Accede a la información del usuario almacenada para decidir a dónde redirigir
          const user = this.authService.currentUserValue;
  
          if (user?.rolId === 2) { // Cliente
            this.router.navigate(['/']); // Redirige al home para clientes
          } else if (user?.rolId === 1) { // Admin
            this.router.navigate(['/admin']); // Redirige al panel de administración
          } else {
            // Manejar otros roles o redirigir a una página de error
          }
          console.log(response);
        },
        error: (error) => {
          console.error(error);
          // Manejar el error de inicio de sesión aquí (mostrar mensaje al usuario, etc.)
        }
      });
  }
  
}
