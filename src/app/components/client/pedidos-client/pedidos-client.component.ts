import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedidos-client',
  templateUrl: './pedidos-client.component.html',
  styleUrls: ['./pedidos-client.component.css']
})
export class PedidosClientComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;

  constructor(
    private authApiService: AuthApiService,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    public authService: AuthService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit() {
    this.getPedidosClient();
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      console.log('UsuarioID desde home:', currentUser.usuarioId);
    }
  }

  getPedidosClient() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.usuarioId) {
      this.authApiService.getAllOrdersAndShippingByUser(currentUser.usuarioId).subscribe({
        next: (data) => {
          const pedidosTransformados = this.transformarPedidos(data);
          console.log('Pedidos Transformados:', pedidosTransformados); // Aquí agregamos el console.log
          this.dataSource.data = pedidosTransformados;
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        },
        error: (err) => console.error('Error fetching orders:', err),
      });
    } else {
      console.error('No se pudo obtener el usuarioID');
    }
  }
  verPedido(pedidoID: number) {
    console.log('PedidoID:', pedidoID);
  }

  transformarPedidos(data: any[]) {
    const agrupadosPorPedido = data.reduce((acc, curr) => {
      if (!acc[curr.pedidoID]) {
        acc[curr.pedidoID] = { ...curr, imagenURL: [curr.imagenURL], nombreProducto: [curr.nombreProducto] };
      } else {
        acc[curr.pedidoID].imagenURL.push(curr.imagenURL);
        acc[curr.pedidoID].nombreProducto.push(curr.nombreProducto);
      }
      return acc;
    }, {});

    return Object.values(agrupadosPorPedido).map((pedido: any) => ({
      ...pedido,
      imagenURL: pedido.imagenURL.join(', '),
      nombreProducto: pedido.nombreProducto.join(', ')
    }));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarDetallesPedidoEnvio(pedidoID: number): void {
    console.log('ID del pedido seleccionado:', pedidoID);
    this.router.navigate(['/client/pedido-envio-details', pedidoID]);
  }

}
