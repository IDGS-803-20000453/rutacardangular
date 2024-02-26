import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-complete-verification',
  templateUrl: './complete-verification.component.html',
  styleUrls: ['./complete-verification.component.css']
})
export class CompleteVerificationComponent implements OnInit {

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.completeVerification();
  }

  completeVerification(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');

    if (token && email) {
      const user = { token: token, email: email };
      console.log("Enviando datos en formato JSON:", JSON.stringify(user));
      this.apiService.completeVerification(user).subscribe({
        next: (response) => {
          console.log('Verificación completada con éxito:', response);
          // Aquí puedes gestionar la respuesta exitosa, como redirigir al usuario
        },
        error: (error) => {
          console.error('Error durante la verificación:', error);
          // Aquí puedes gestionar el error
        }
      });
    } else {
      console.error('Token o email no disponibles');
      // Manejo de caso donde el token o el email no están disponibles
    }
    
  }
}