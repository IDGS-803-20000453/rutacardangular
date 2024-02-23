import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  password: string = '';

  constructor(private apiService: ApiService, private router: Router) { }

  signUp() {
    const user = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      password: this.password
    };

    this.apiService.signUp(user).subscribe({
      next: (response) => {
        // Manejar la respuesta exitosa, por ejemplo redirigiendo al usuario a la página de inicio de sesión o directamente al dashboard
        console.log('Registro exitoso', response);
        this.router.navigate(['/login']); // Opcional: Redirigir al inicio de sesión
      },
      error: (error) => {
        // Manejar errores de registro aquí
        console.error('Error en el registro', error);
      }
    });
  }
}
