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
  registrationSuccess: boolean = false; // Nueva propiedad para controlar la visibilidad

  constructor(private apiService: ApiService) { }

  signUp() {
    const user = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      password: this.password
    };

    this.apiService.startVerification(user).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        this.registrationSuccess = true; // Oculta el formulario y muestra el mensaje de éxito
      },
      error: (error) => {
        console.error('Error en el registro', error);
      }
    });
  }
}
