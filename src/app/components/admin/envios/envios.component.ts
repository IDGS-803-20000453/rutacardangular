import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthApiService } from 'src/app/services/auth-api.service';

@Component({
  selector: 'app-envios',
  templateUrl: './envios.component.html',
  styleUrls: ['./envios.component.css']
})
export class EnviosComponent implements OnInit {
  envio: any; // Objeto para almacenar los detalles del envío

  constructor(
    private route: ActivatedRoute,
    private authApiService: AuthApiService
  ) { }

  ngOnInit(): void {
    this.getEnvioDetails();
  }

  getEnvioDetails(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const id = +idParam; // Convertir el ID del envío a número
      this.authApiService.getEnvio(id).subscribe(envio => {
        this.envio = envio; // Asignar los detalles del envío obtenidos del servicio
      });
    } else {
      console.error('ID del envío no encontrado en los parámetros de la ruta');
    }
  }
}
