import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  userEmail: string = '';

  constructor(private apiService: ApiService) { }

  onSubmit() {
    if (this.userEmail) {
      this.apiService.forgotPassword(this.userEmail).subscribe({
        next: (response) => {
          console.log('Enlace de restablecimiento enviado.', response);
          // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
        },
        error: (error) => {
          console.error('Error enviando el enlace de restablecimiento.', error);
          // Manejar el error, por ejemplo, mostrando un mensaje al usuario
        }
      });
    }
  }
}