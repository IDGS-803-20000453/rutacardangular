import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token!: string;
  email!: string; // Define el correo electrónico como una propiedad de la clase

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token') || '';
      this.email = params.get('email') || ''; // Obtienes el correo electrónico de la URL
    });
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('newPassword')?.value;
    let confirmPass = group.get('confirmPassword')?.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.token && this.email) {
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;

      this.apiService.resetPassword({
        email: this.email, // Usa la propiedad email de la clase
        token: this.token,
        newPassword: newPassword
      }).subscribe({
        next: (response) => {
          console.log('Contraseña restablecida con éxito.', response);
          // Aquí puedes redirigir al usuario o mostrar un mensaje de éxito
        },
        error: (error) => {
          console.error('Error al restablecer la contraseña.', error);
          // Manejar el error, por ejemplo, mostrando un mensaje al usuario
        }
      });
    }
  }
}
