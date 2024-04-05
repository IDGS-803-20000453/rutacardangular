import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pedido-envio-details',
  templateUrl: './pedido-envio-details.component.html',
  styleUrls: ['./pedido-envio-details.component.css']
})
export class PedidoEnvioDetailsComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  pedidoIDStatic: number = 1; // Variable estática para el ID de pedido
  estadoEnvio: string = '';
  mostrarBolita2: boolean = false;
  mostrarBolita3: boolean = false;

  constructor(
    private authApiService: AuthApiService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.dataSource = new MatTableDataSource<any>();
  }


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // Asegura primero el valor antes de la conversión
      const pedidoIDRaw = params.get('pedidoID');
      const pedidoID = pedidoIDRaw !== null ? +pedidoIDRaw : 0;
  
      if (pedidoID > 0) {
        this.pedidoIDStatic = pedidoID;
        this.getPedidoEnvioDetails();
      } else {
        console.error('PedidoID no válido o no encontrado');
        // Manejo de error o lógica alternativa
      }
    });
  }
  goBack(): void {
    this.location.back(); // Método para regresar a la página anterior
  }
  

  getPedidoEnvioDetails() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.usuarioId) {
      this.authApiService.getAllOrdersAndShippingByUser(currentUser.usuarioId).subscribe({
        next: (data) => {
          // Primero, filtramos los datos para obtener el pedido específico
          const filteredData = data.filter((pedido: { pedidoID: number; }) => pedido.pedidoID === this.pedidoIDStatic);
          this.dataSource.data = filteredData;
  
          // Ahora, actualizamos estadoEnvio basándonos en el pedido específico, si existe
          if (filteredData.length > 0) {
            this.estadoEnvio = filteredData[0].estadoEnvio;
            console.log('Estado de Envío:', this.estadoEnvio);
  
            // Luego, actualizamos la visibilidad de las bolitas basada en el estado de envío
            this.mostrarBolita2 = this.estadoEnvio === 'Enviado' || this.estadoEnvio === 'Entregado';
            this.mostrarBolita3 = this.estadoEnvio === 'Entregado';
          }
  
          // Configuración opcional del paginator, si es necesario
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
  
          console.log('Datos Filtrados:', filteredData);
        },
        error: (err) => console.error('Error fetching orders:', err),
      });
    } else {
      console.error('No se pudo obtener el usuarioID');
    }
  }
  
  
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
