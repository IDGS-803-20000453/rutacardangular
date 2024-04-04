import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

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
  confirmPassword: string = ''; // Agrega esta línea
  registrationSuccess: boolean = false;
  errorMessage: string = ''; // Agrega esta línea para manejar mensajes de error

  constructor(private apiService: ApiService) { }

  signUp() {
    if (this.password !== this.confirmPassword) {
      // Si las contraseñas no coinciden, establece un mensaje de error y detén la ejecución.
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    // Si las contraseñas coinciden, procede con el registro.
    const user = {
      nombre: this.nombre.toUpperCase(), 
      apellido: this.apellido.toUpperCase(),
      email: this.email,
      password: this.password
    };

    this.apiService.startVerification(user).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        this.registrationSuccess = true; 
      },
      error: (error) => {
        console.error('Error en el registro', error);
        this.errorMessage = 'Error en el registro. Intente nuevamente.';
      }
    });
  }
}
